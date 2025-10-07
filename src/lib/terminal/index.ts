import { about } from './about.tsx';
import { help } from './help.tsx';
import { whoami } from './whoami';
import { test } from './test';
import { type Command } from './types';

export const commands: { [key: string]: Command } = {
  about,
  help,
  whoami,
  test,
};
