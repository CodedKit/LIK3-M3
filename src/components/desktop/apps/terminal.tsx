
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserProfileContext, type UserProfile } from '@/context/user-profile-context';
import { commands } from '@/lib/terminal';
import { type TerminalHistoryItem } from '@/hooks/use-user-profile';

const WELCOME_MESSAGE = `Welcome to LIK3 M3 Terminal
Type 'help' for a list of commands.`;

interface TerminalAppProps {
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

export default function TerminalApp({ setShowDebug }: TerminalAppProps) {
  const { activeProfile, updateProfile } = useUserProfileContext();
  const [history, setHistory] = useState<TerminalHistoryItem[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfContentRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';
  const prompt = `[${user}@lik3m3 ~]$`;

  // Load history from active profile on mount or profile change
  useEffect(() => {
    if (activeProfile?.terminalHistory) {
      setHistory(activeProfile.terminalHistory);
    }
  }, [activeProfile]);

  // Scroll to bottom when history changes
  useEffect(() => {
    endOfContentRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  const handleCommandSubmit = (commandStr: string) => {
    if (!activeProfile) return;

    const trimmedCommand = commandStr.trim();
    if (trimmedCommand === '') return;

    let newHistory: TerminalHistoryItem[];

    if (trimmedCommand.toLowerCase() === 'clear') {
      newHistory = [];
    } else {
      const [commandName, ...args] = trimmedCommand.split(' ');
      const commandToExecute = commands[commandName.toLowerCase()];
      let output: React.ReactNode;

      if (commandToExecute) {
        output = commandToExecute.execute({ args, commands, user, setShowDebug });
      } else {
        output = `Command not found: ${commandName}. Type 'help' for a list of commands.`;
      }
      
      const newHistoryItem: TerminalHistoryItem = { command: trimmedCommand, output };
      newHistory = [...history, newHistoryItem];
    }
    
    setHistory(newHistory);
    updateProfile(activeProfile.id, { terminalHistory: newHistory });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(input);
      setInput('');
    }
  };

  const renderPrompt = () => (
    <span className="flex-shrink-0">
        <span className="text-green-400">{user}</span>
        <span className="text-primary-foreground">@lik3m3 ~]$</span>
    </span>
  );

  return (
    <div
      className="h-full w-full bg-black p-4 font-code text-sm text-primary-foreground focus:outline-none"
      onClick={() => inputRef.current?.focus()}
      tabIndex={0}
    >
        <pre className="whitespace-pre-wrap text-muted-foreground">{WELCOME_MESSAGE}</pre>
        {history.map((item, index) => (
            <div key={index}>
                <div className="flex gap-2">
                    {renderPrompt()}
                    <span>{item.command}</span>
                </div>
                <div className="whitespace-pre-wrap text-muted-foreground">{item.output}</div>
            </div>
        ))}
      
      <div className="flex gap-2">
        {renderPrompt()}
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
