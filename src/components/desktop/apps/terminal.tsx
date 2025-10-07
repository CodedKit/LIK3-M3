
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { cn } from '@/lib/utils';
import { commands } from '@/lib/terminal';

type Command = {
  command: string;
  output: React.ReactNode;
};

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
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    logToConsole('Welcome to LIK3 M3 Terminal');
    logToConsole("Type 'help' for a list of commands.");
  }, [logToConsole]);

  const handleCommand = (commandStr: string) => {
    const [commandName, ...args] = commandStr.trim().split(' ');
    let output: React.ReactNode = `Command not found: ${commandName}. Type 'help' for a list of commands.`;

    if(commandStr.trim() === '') {
        setHistory((prev) => [...prev, { command: '', output: '' }]);
        return;
    }

    if (commandName.toLowerCase() === 'clear') {
      setHistory([]);
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
      // This is a bit tricky since output is ReactNode. For logging, we'll try to get a string representation.
      // This is a simplified approach.
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
      <div>
        <p>Welcome to LIK3 M3 Terminal</p>
        <p>Type 'help' for a list of commands.</p>
        <br />
      </div>
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
