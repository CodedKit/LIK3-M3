
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { commands } from '@/lib/terminal';
import { type TerminalHistoryItem, type UserProfile } from '@/context/user-profile-context';

const WELCOME_MESSAGE = `Welcome to LIK3 M3 Terminal
Type \'help\' for a list of commands.`;

interface TerminalAppProps {
  setShowDebug: (show: boolean | ((s: boolean) => boolean)) => void;
  updateProfile: (profileId: string, updatedData: Partial<Omit<UserProfile, 'id'>>) => void;
  activeProfile: UserProfile | null;
}

function isReactNode(node: any): node is React.ReactNode {
  return React.isValidElement(node) || typeof node === 'string' || typeof node === 'number' || Array.isArray(node);
}

export default function TerminalApp({ setShowDebug, updateProfile, activeProfile }: TerminalAppProps) {
  const [sessionHistory, setSessionHistory] = useState<TerminalHistoryItem[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfContentRef = useRef<HTMLDivElement>(null);

  const user = activeProfile?.username || 'user';

  useEffect(() => {
    if (activeProfile?.terminalHistory) {
      setSessionHistory(activeProfile.terminalHistory.map(item => ({...item, output: item.output || ''})));
    }
  }, [activeProfile]);

  useEffect(() => {
    endOfContentRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [sessionHistory]);

  const handleCommandSubmit = (commandStr: string) => {
    if (!activeProfile) return;

    const trimmedCommand = commandStr.trim();
    if (trimmedCommand === '') {
      setSessionHistory(prev => [...prev, { command: '', output: '' }]);
      return;
    }

    if (trimmedCommand.toLowerCase() === 'clear') {
      setSessionHistory([]);
      updateProfile(activeProfile.id, { terminalHistory: [] });
      setInput('');
      return;
    }

    const [commandName, ...args] = trimmedCommand.split(' ');
    const commandToExecute = commands[commandName.toLowerCase()];
    let output: React.ReactNode;
    let persistentOutput: string;

    if (commandToExecute) {
      output = commandToExecute.execute({ args, commands, user, setShowDebug, activeProfile, updateProfile });
    } else {
      output = `Command not found: ${commandName}. Type \'help\' for a list of commands.`;
    }

    if (typeof output === 'string') {
      persistentOutput = output;
    } else if (isReactNode(output)) {
      persistentOutput = `[Formatted Output]`; 
    } else {
      persistentOutput = String(output);
    }
    
    const newSessionHistoryItem: TerminalHistoryItem = { command: trimmedCommand, output };
    setSessionHistory(prev => [...prev, newSessionHistoryItem]);

    const newPersistentHistoryItem: TerminalHistoryItem = { command: trimmedCommand, output: persistentOutput };
    const newPersistentHistory = [...(activeProfile.terminalHistory || []), newPersistentHistoryItem];

    if (commandToExecute) { // Only update profile if it was a real command
        updateProfile(activeProfile.id, { terminalHistory: newPersistentHistory });
    }
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSubmit(input);
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
