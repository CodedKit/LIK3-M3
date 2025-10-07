
'use client';

import { useState, useRef, useEffect } from 'react';
import { useUserProfileContext } from '@/context/user-profile-context';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (commandStr: string) => {
    let output: React.ReactNode;
    const [command, ...args] = commandStr.trim().split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        output = (
          <ul className="list-disc pl-5">
            <li><span className="font-bold text-pink-400">about</span> - learn more about LIK3 M3</li>
            <li><span className="font-bold text-pink-400">whoami</span> - display the current user</li>
            <li><span className="font-bold text-pink-400">clear</span> - clear the terminal</li>
            <li><span className="font-bold text-pink-400">help</span> - show this help message</li>
          </ul>
        );
        break;
      case 'whoami':
        output = user;
        break;
      case 'about':
        output = (
            <p>
                <span className='font-headline text-primary'>LIK3 M3</span> is a virtual space for exploring identity.
            </p>
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        output = null;
        break;
      default:
        output = `Command not found: ${command}. Type 'help' for a list of commands.`;
        break;
    }
    
    if(output !== null){
        setHistory((prev) => [...prev, { command: commandStr, output }]);
    } else {
        setHistory((prev) => [...prev, { command: '', output: ''}]);
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
