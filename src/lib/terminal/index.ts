
import { about } from './about';
import { help } from './help';
import { whoami } from './whoami';
import { test } from './test';
import { type Command } from './types';
import { debug } from './debug';

export const commands: { [key: string]: Command } = {
  about,
  help,
  whoami,
  test,
  debug,
};
