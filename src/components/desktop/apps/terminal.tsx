
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { commands } from '@/lib/terminal';

const TERMINAL_STORAGE_KEY = 'virtual-temptations-terminal-current';
const WELCOME_MESSAGE = `Welcome to LIK3 M3 Terminal
Type 'help' for a list of commands.`;

interface TerminalAppProps {
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

export default function TerminalApp({ setShowDebug }: TerminalAppProps) {
  const { activeProfile } = useUserProfileContext();
  const [content, setContent] = useState('');
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfContentRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';
  const prompt = `[${user}@lik3m3 ~]$`;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedContent = window.localStorage.getItem(TERMINAL_STORAGE_KEY);
      if (savedContent) {
        setContent(savedContent);
      } else {
        setContent(WELCOME_MESSAGE);
      }
    } catch (error) {
      console.error("Failed to load terminal content from localStorage", error);
      setContent(WELCOME_MESSAGE);
    }
    inputRef.current?.focus();
  }, []);

  // Save to localStorage on content change
  useEffect(() => {
    try {
      window.localStorage.setItem(TERMINAL_STORAGE_KEY, content);
    } catch (error) {
      console.error("Failed to save terminal content to localStorage", error);
    }
    endOfContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [content]);

  // Helper to convert ReactNode to string for consistent storage
  const getOutputAsString = (output: React.ReactNode): string => {
    if (typeof output === 'string') return output;
    if (React.isValidElement(output) && typeof output.props.children === 'string') {
        // Simple case for <p> or <li> with string children
        return output.props.children;
    }
    // Fallback for more complex components, may need improvement
    return '[object]';
  };

  const handleCommand = (commandStr: string) => {
    const trimmedCommand = commandStr.trim();
    const commandLine = `${prompt} ${trimmedCommand}`;
    let newContent = content ? `${content}\n${commandLine}` : commandLine;
    
    if (trimmedCommand === '') {
        setContent(newContent);
        console.log(commandLine);
        return;
    }

    const [commandName, ...args] = trimmedCommand.split(' ');

    if (commandName.toLowerCase() === 'clear') {
      setContent('');
      try {
        window.localStorage.removeItem(TERMINAL_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear terminal history from localStorage", error);
      }
      return;
    }

    const commandToExecute = commands[commandName.toLowerCase()];
    let output: string;

    if (commandToExecute) {
      // The `execute` functions now need to return a string.
      const rawOutput = commandToExecute.execute({ args, commands, user, setShowDebug });
      output = getOutputAsString(rawOutput); // Ensure we have a string
    } else {
      output = `Command not found: ${commandName}. Type 'help' for a list of commands.`;
    }
    
    newContent = `${newContent}\n${output}`;
    setContent(newContent);
    console.log(commandLine);
    console.log(output);
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
      <pre className="whitespace-pre-wrap">{content}</pre>
      
      <div className="flex gap-2">
        <label htmlFor="terminal-input" className="text-pink-500">
          {prompt}
        </label>
        <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full flex-1 bg-transparent text-green-400 focus:outline-none caret-green-400"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
      </div>
      <div ref={endOfContentRef} />
    </div>
  );
}
