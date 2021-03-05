#!/usr/bin/env node

import {exec, ExecException, SendHandle, Serializable} from 'child_process';
import yargs from 'yargs';
import inquirer from 'inquirer';
import {isYesInput, yes} from './utils';

export type Stringx = string | null | undefined;

/**
 * This interface should be extended by an interface in the implementing code base to define
 * the contract for each command option switch/flag that will be used in the cli command.
 */
export interface IBaseCmdOptions {
  [k: string]: any;
}

export interface ICommandInfo {
  name: string;
  args: string[];
  options: IBaseCmdOptions;
}

export interface ISpawnCallbacks {
  stdout: (stream: Buffer, data: string) => void;
  stderr: (stream: Buffer, data: string) => void;
  error: (error: Error) => void;
  close: (code: number, signal: NodeJS.Signals) => void;
  exit?: (code: number, signal: NodeJS.Signals) => void;
  message?: (message: Serializable, sendHandle: SendHandle) => void;
}

/**
 * Prompt user to enter input (uses [inquirer]{@link https://www.npmjs.com/package/inquirer}).
 *
 * @param name
 * @param message
 */
const askInput = async (name: string = 'input', message: string = 'Enter input') => {
  const result = await inquirer.prompt({
    type: 'input',
    name,
    message
  });

  return result[name];
};

/**
 * Prompt user to select an option from a set of choices (uses [inquirer]{@link https://www.npmjs.com/package/inquirer}).
 * @param name
 * @param message
 * @param choices
 * @param multiple
 */
const askSelect = async (
  name: string = 'choice',
  message: string = 'Select choice',
  choices: any[] = [],
  multiple = false
) => {
  if (choices && choices.length > 0) {
    const result = await inquirer.prompt({
      type: yes(multiple) ? 'checkbox' : 'list',
      name,
      message,
      choices
    });

    return result[name] || '';
  }
  return '';
};

/**
 * Prompt user to select multiple options from a set of choices (uses [inquirer]{@link https://www.npmjs.com/package/inquirer}).
 * @param name
 * @param message
 * @param choices
 */
const askSelectMultiple = async (name: string = 'choice', message: string = 'Select choice', choices: any[]) => {
  return await askSelect(name, message, choices, true);
};

export const cliyargs = {
  yargs,

  /**
   * Get the arguments string passed to the cli command for the calling context.
   */
  getCommandArgs(): string {
    let command = '';

    process.argv.forEach((entry, i) => {
      if (i > 1) {
        command += entry + ' ';
      }
    });

    return command.replace(/\s+$/, '');
  },

  /**
   * Parse the `argv` parameter that is the result of `cliyargs.yargs.command().command()...argv`
   * @param argv
   */
  parseArgv(argv: any): ICommandInfo {
    let commandInfo: ICommandInfo = {
      name: '',
      args: [],
      options: {}
    };

    if (!argv._) {
      return {
        name: '',
        options: {},
        args: []
      };
    }

    const commands = argv._;
    commandInfo.name = (commands && commands.length > 0 ? commands[0] : '').trim();

    argv._.forEach((arg: string, idx: number) => {
      if (idx > 0) {
        commandInfo.args.push(arg);
      }
    });

    for (let o in argv) {
      if (argv.hasOwnProperty(o) && o !== '_' && o !== '$0') {
        commandInfo.options = {
          ...commandInfo.options,
          [o]: argv[o]
        };
      }
    }

    return commandInfo;
  },
  /**
   * Process the command.
   *
   * @param commandInfo Info about the command
   * @param processorCb Callback function in which to process the command as preferred.
   */
  async processCommand(commandInfo: ICommandInfo, processorCb: (commandName: string) => void) {
    let mainCommand = commandInfo.name;

    // Protect from dangerous commands
    switch (true) {
      case /rm\s+/.test(mainCommand):
      case /rmdir\s+/.test(mainCommand):
      case /del\s+/.test(mainCommand):
      case /unlink\s+/.test(mainCommand):
      case /move\s+/.test(mainCommand):
      case /cp\s+/.test(mainCommand):
      case /copy\s+/.test(mainCommand):
        return;
    }

    switch (mainCommand) {
      default:
        processorCb(mainCommand);
        break;
    }
  },

  askInput,
  askSelect,
  askSelectMultiple,
  isYesInput
};

export const execShellCmd = async (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout);
    });
  });
};
