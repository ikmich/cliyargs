import { exec, ExecException, SendHandle, Serializable } from 'child_process';
import yargs from 'yargs';
import inquirer from 'inquirer';
import { isYesInput } from './utils';

export type Stringx = string | null | undefined;

/**
 * This interface should be extended by an interface in the implementing code base to define
 * the contract for each command option switch/flag that will be used in the cli command.
 */
export interface IClyCommandOpts {
  [k: string]: any;
}

export interface IClyCommandInfo<T extends IClyCommandOpts> {
  name: string;
  args: string[];
  options: T;
}

export abstract class ClyBaseCommand<T extends IClyCommandOpts> {
  public commandInfo: IClyCommandInfo<T>;
  protected name: string;
  protected args: string[] = [];
  protected options: T = {} as T;

  constructor(commandInfo: IClyCommandInfo<T>) {
    this.commandInfo = commandInfo;
    this.name = commandInfo.name;
    this.args = commandInfo.args;
    this.options = commandInfo.options;
  }

  getArg(position: number): Stringx {
    if (position < 1) position = 1;
    if (position > this.args.length) return null;
    return this.args[position - 1] ?? '';
  }

  /**
   * Executes actions to run the command.
   */
  async run() {}
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
      type: multiple ? 'checkbox' : 'list',
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
  /**
   * @type yargs
   */
  yargs: yargs,

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
   * Parse the `argv` parameter that is the result of `cliyargs.yargs.argv`
   * @param argv
   */
  parseYargv<T extends IClyCommandOpts>(argv: any): IClyCommandInfo<T> {
    let commandInfo: IClyCommandInfo<T> = {
      name: '',
      args: [],
      options: {} as T
    };

    if (!argv || !argv._) {
      return commandInfo;
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
  processCommand<T extends IClyCommandOpts>(
    commandInfo: IClyCommandInfo<T>,
    processorCb: (commandName: string) => void
  ) {
    let mainCommand = commandInfo.name;
    processorCb(mainCommand);
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
