
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface TaskbarClockProps {
    onClick: () => void;
}

export default function TaskbarClock({ onClick }: TaskbarClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Button variant="ghost" onClick={onClick} className="h-auto px-2 py-1">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Button>
  );
}
