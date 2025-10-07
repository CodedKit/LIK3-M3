
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { commands } from '@/lib/terminal';
import { type TerminalHistoryItem } from '@/hooks/use-user-profile';
import { renderToString } from 'react-dom/server';


const WELCOME_MESSAGE = `Welcome to LIK3 M3 Terminal
Type 'help' for a list of commands.`;

interface TerminalAppProps {
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
}

function isReactNode(node: any): node is React.ReactNode {
    return React.isValidElement(node) || typeof node === 'string' || typeof node === 'number' || Array.isArray(node);
}

export default function TerminalApp({ setShowDebug }: TerminalAppProps) {
  const { activeProfile, updateProfile } = useUserProfileContext();
  
  // sessionHistory is for display, can contain JSX
  const [sessionHistory, setSessionHistory] = useState<TerminalHistoryItem[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfContentRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';

  // Load history from active profile on mount or profile change
  useEffect(() => {
    if (activeProfile?.terminalHistory) {
        // Initialize session history from the persistent, safe history.
        setSessionHistory(activeProfile.terminalHistory);
    }
  }, [activeProfile]);

  // Scroll to bottom when history changes
  useEffect(() => {
    endOfContentRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [sessionHistory]);

  const handleCommandSubmit = (commandStr: string) => {
    if (!activeProfile) return;

    const trimmedCommand = commandStr.trim();
    if (trimmedCommand === '') return;

    if (trimmedCommand.toLowerCase() === 'clear') {
        setSessionHistory([]);
        updateProfile(activeProfile.id, { terminalHistory: [] });
        return;
    }

    const [commandName, ...args] = trimmedCommand.split(' ');
    const commandToExecute = commands[commandName.toLowerCase()];
    let output: React.ReactNode;

    if (commandToExecute) {
      output = commandToExecute.execute({ args, commands, user, setShowDebug });
    } else {
      output = `Command not found: ${commandName}. Type 'help' for a list of commands.`;
    }
    
    // For immediate display in the current session
    const newSessionHistoryItem: TerminalHistoryItem = { command: trimmedCommand, output };
    setSessionHistory(prev => [...prev, newSessionHistoryItem]);

    // For persistent storage (ensure output is a string)
    let persistentOutput: string;
    if (typeof output === 'string') {
        persistentOutput = output;
    } else if (isReactNode(output)) {
        // This is a simplified serialization. For complex components, it might not be perfect.
        persistentOutput = "[Formatted Output]"; 
    } else {
        persistentOutput = String(output);
    }
    
    const newPersistentHistoryItem: TerminalHistoryItem = { command: trimmedCommand, output: persistentOutput };
    const newPersistentHistory = [...(activeProfile.terminalHistory || []), newPersistentHistoryItem];

    updateProfile(activeProfile.id, { terminalHistory: newPersistentHistory });
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
        {sessionHistory.map((item, index) => (
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
