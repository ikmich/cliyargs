import { exec, ExecException, SendHandle, Serializable } from 'child_process';
import yargs from 'yargs';
import inquirer from 'inquirer';
import { isYesInput } from './utils';

/**
 * @deprecated
 * (deprecated)
 */
export type Stringx = string | null | undefined;

/**
 * @deprecated
 * (deprecated) Use CliOptions
 */
export interface BaseCmdOpts {
  [k: string]: any;
}

/**
 * Interface representing command options (flags/switches). Extend this interface to define
 * the contract for the command option flags that will be used in the cli command.
 */
export interface CliOptions {
  [k: string]: any;
}

/**
 * Defines contract for the command object as structured by cliyargs.
 */
export interface CmdInfo<T extends CliOptions> {
  name: string;
  args: string[];
  options: T;
}

/**
 * Extend this class to process the cli command logic. The command info and option flags are made available
 * as properties of the class. Override and implement the `async run()` method.
 */
export abstract class BaseCmd<T extends CliOptions> {
  public readonly commandInfo: CmdInfo<T>;
  protected name: string;
  protected args: string[] = [];
  protected options: T = {} as T;

  constructor(commandInfo: CmdInfo<T>) {
    this.commandInfo = commandInfo;
    this.name = commandInfo.name;
    this.args = commandInfo.args;
    this.options = commandInfo.options;
  }

  getArg(position: number): string | null | undefined {
    if (position < 1) position = 1;
    if (position > this.args.length) return null;
    return this.args[position - 1] ?? '';
  }

  /**
   * Executes actions to run the command.
   */
  async run() {
  }
}

export interface CommandDef {
  name: string;
  description: string;
}

export type YargsOptionType = 'array' | 'count' | yargs.PositionalOptionsType | undefined;

export interface OptionFlagDef {
  name: string;
  alias?: string | string[];
  type: YargsOptionType;
  description?: string;
}

export interface CliConfiguration {
  commands: CommandDef[];
  optionFlags?: OptionFlagDef[];
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

  // @ts-ignore
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

    // @ts-ignore
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

export type ArgvType = { [p: string]: unknown; _: (string | number)[]; $0: string };

export type CommandHandler<T extends CliOptions> = (commandInfo: CmdInfo<T>, argv?: ArgvType) => any;

export type BootstrapResult<T extends CliOptions> = {
  argv: ArgvType;
  commandInfo: CmdInfo<T>;
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
  getCommandInfo<T extends CliOptions>(argv: any): CmdInfo<T> {
    let commandInfo: CmdInfo<T> = {
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
  processCommand<T extends CliOptions>(commandInfo: CmdInfo<T>, processorCb: (commandName: string) => void) {
    let mainCommand = commandInfo.name;
    processorCb(mainCommand);
  },

  askInput,
  askSelect,
  askSelectMultiple,
  isYesInput,

  /**
   * Bootstrap your cli and set up the command handling logic.
   * @param configuration
   * @param handler
   */
  bootstrap<T extends CliOptions>(configuration: CliConfiguration, handler: CommandHandler<T>): BootstrapResult<T> {
    const argv = (() => {
      let argv = cliyargs.yargs;

      for (let commandDef of configuration.commands) {
        argv.command(commandDef.name, commandDef.description);
      }

      if (configuration.optionFlags) {
        for (let optionFlag of configuration.optionFlags) {
          if (optionFlag.name) {
            argv.option(optionFlag.name, {
              type: optionFlag.type,
              desc: optionFlag.description
            });

            if (optionFlag.alias) {
              const aliasVal = (() => {
                if (typeof optionFlag.alias === 'string') {
                  return [optionFlag.alias];
                }

                if (Array.isArray(optionFlag.alias)) {
                  return optionFlag.alias;
                }

                return String(optionFlag.alias);
              })();

              argv.alias(optionFlag.name, aliasVal);
            }
          }
        }
      }

      return argv.help().argv;
    })();

    const commandInfo: CmdInfo<T> = this.getCommandInfo(argv);

    handler(commandInfo, argv);

    return {
      argv,
      commandInfo
    };
  }
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
