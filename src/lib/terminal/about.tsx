import { type Command } from './types';
import React from 'react';

export const about: Command = {
  name: 'about',
  description: 'Learn more about LIK3 M3',
  execute: () => (
    <p>
      <span className="font-headline text-primary">LIK3 M3</span> is a virtual space for exploring identity.
    </p>
  ),
};
