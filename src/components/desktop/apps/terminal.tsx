
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { commands } from '@/lib/terminal';

const HISTORY_STORAGE_KEY = 'lik3-m3-terminal-history';
const WELCOME_MESSAGE = `Welcome to LIK3 M3 Terminal
Type 'help' for a list of commands.`;

interface HistoryItem {
  command: string;
  output: string;
}

interface TerminalAppProps {
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

export default function TerminalApp({ setShowDebug }: TerminalAppProps) {
  const { activeProfile } = useUserProfileContext();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfContentRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';
  const prompt = `[${user}@lik3m3 ~]$`;

  // Function to get a command's output
  const getCommandOutput = (commandStr: string): string => {
    const trimmedCommand = commandStr.trim();
    if (trimmedCommand === '') return '';
  
    if (trimmedCommand.toLowerCase() === 'clear') {
      setHistory([]);
      try {
        window.localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear terminal history from localStorage", error);
      }
      return '';
    }
  
    const [commandName, ...args] = trimmedCommand.split(' ');
    const commandToExecute = commands[commandName.toLowerCase()];
  
    if (commandToExecute) {
      const output = commandToExecute.execute({ args, commands, user, setShowDebug });
      if (typeof output === 'string') {
        return output;
      }
      return '[non-string output]';
    } else {
      return `Command not found: ${commandName}. Type 'help' for a list of commands.`;
    }
  };

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistoryItem = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      const savedHistory: HistoryItem[] = savedHistoryItem ? JSON.parse(savedHistoryItem) : [];
      setHistory(savedHistory);
    } catch (error) {
      console.error("Failed to load terminal history from localStorage", error);
      setHistory([]);
    }
  }, []);

  // Scroll to bottom when history changes
  useEffect(() => {
    endOfContentRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  const handleCommandSubmit = (commandStr: string) => {
    const trimmedCommand = commandStr.trim();
    
    if (trimmedCommand.toLowerCase() === 'clear') {
        setHistory([]);
        try {
          window.localStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch (error) {
          console.error("Failed to clear terminal history from localStorage", error);
        }
        return;
      }

    const output = getCommandOutput(trimmedCommand);
    
    if (trimmedCommand !== '') {
        const newHistoryItem: HistoryItem = { command: trimmedCommand, output };
        const newHistory = [...history, newHistoryItem];
        setHistory(newHistory);
        try {
          window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
        } catch (error) {
          console.error("Failed to save terminal history to localStorage", error);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(input);
      setInput('');
    }
  };

  return (
    <div
      className="h-full w-full bg-black p-4 font-code text-sm text-primary-foreground focus:outline-none"
      onClick={() => inputRef.current?.focus()}
      tabIndex={0}
    >
        <pre className="whitespace-pre-wrap">{WELCOME_MESSAGE}</pre>
        {history.map((item, index) => (
            <div key={index}>
                <div className="flex gap-2">
                    <span className="text-green-400">{prompt}</span>
                    <span>{item.command}</span>
                </div>
                {item.output && <pre className="whitespace-pre-wrap">{item.output}</pre>}
            </div>
        ))}
      
      <div className="flex gap-2">
        <label htmlFor="terminal-input" className="flex-shrink-0 text-green-400">
          {prompt}
        </label>
        <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full flex-1 bg-transparent text-primary-foreground focus:outline-none caret-green-400"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
      </div>
      <div ref={endOfContentRef} />
    </div>
  );
}
