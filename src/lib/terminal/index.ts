
import { about } from './about';
import { help } from './help';
import { whoami } from './whoami';
import { test } from './test';
import { type Command } from './types';
import { debug } from './debug';
import { clear } from './clear';
import { cheat } from './cheat';

export const commands: { [key: string]: Command } = {
  about,
  help,
  whoami,
  test,
  debug,
  clear,
  cheat,
};
