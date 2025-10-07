
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { cn } from '@/lib/utils';
import { commands } from '@/lib/terminal';

type Command = {
  command: string;
  output: React.ReactNode;
};

const TERMINAL_HISTORY_KEY = 'virtual-temptations-terminal-history';

export default function TerminalApp() {
  const { activeProfile } = useUserProfileContext();
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';
  const prompt = `[${user}@lik3m3 ~]$`;

  const logToConsole = useCallback((...args: any[]) => {
    console.log(...args);
  }, []);

  useEffect(() => {
    try {
      const savedHistory = window.localStorage.getItem(TERMINAL_HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load terminal history from localStorage", error);
    }
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    try {
        window.localStorage.setItem(TERMINAL_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save terminal history to localStorage", error);
    }
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (history.length === 0) { // Only log initial welcome messages if history is empty
        logToConsole('Welcome to LIK3 M3 Terminal');
        logToConsole("Type 'help' for a list of commands.");
    }
  }, [logToConsole, history.length]);

  const handleCommand = (commandStr: string) => {
    const [commandName, ...args] = commandStr.trim().split(' ');
    let output: React.ReactNode = `Command not found: ${commandName}. Type 'help' for a list of commands.`;

    if(commandStr.trim() === '') {
        setHistory((prev) => [...prev, { command: '', output: '' }]);
        return;
    }

    if (commandName.toLowerCase() === 'clear') {
      setHistory([]);
      try {
        window.localStorage.removeItem(TERMINAL_HISTORY_KEY);
      } catch (error) {
          console.error("Failed to clear terminal history from localStorage", error);
      }
      return;
    }
    
    const commandToExecute = commands[commandName.toLowerCase()];
    
    if (commandToExecute) {
      output = commandToExecute.execute({ args, commands, user });
    }

    const newHistoryItem = { command: commandStr, output };
    setHistory((prev) => [...prev, newHistoryItem]);
    
    logToConsole(`${prompt} ${commandStr}`);
    if (output) {
      if (typeof output === 'string') {
        logToConsole(output);
      } else {
        logToConsole('[ReactNode Output]');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div
      className="h-full w-full bg-black p-4 font-code text-sm text-green-400 focus:outline-none"
      onClick={() => inputRef.current?.focus()}
      tabIndex={0}
    >
      {history.length === 0 && (
        <div>
          <p>Welcome to LIK3 M3 Terminal</p>
          <p>Type 'help' for a list of commands.</p>
          <br />
        </div>
      )}
      {history.map((item, index) => (
        <div key={index}>
          <div className="flex gap-2">
            <span className="text-pink-500">{prompt}</span>
            <span>{item.command}</span>
          </div>
          {item.output && <div className="text-white">{item.output}</div>}
        </div>
      ))}
      <div className="flex gap-2">
        <label htmlFor="terminal-input" className="text-pink-500">
          {prompt}
        </label>
        <div className="relative flex-1">
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full bg-transparent text-green-400 focus:outline-none caret-green-400"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
           <span className={cn(input ? 'invisible' : 'animate-pulse')}>_</span>
        </div>
      </div>
       <div ref={endOfHistoryRef} />
    </div>
  );
}
