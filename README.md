# Intro

**cliyargs** builds on top of yargs to provide a structured class-based interface for developing command line
applications with NodeJS.

## Typical Usage

```typescript
/* 1a. Setup your commands and get the argv variable. */
import { BaseCmdOpts, cliyargs, CmdInfo } from 'cliyargs';

// basic yargs setup
const argv = cliyargs.yargs
  // Define the commands
  .command('init', 'Initialize parameters')
  .command('print', 'Print outputs')
  .command('list', 'List artifacts')

  // Define options (command flags/switches)
  .option('verbose', {
    type: 'boolean',
    description: 'Show more info'
  })
  .option('debug', {
    type: 'boolean',
    description: 'Enable debugging'
  })

  // Enable the 'help' command for your cli app
  .help().argv;

/* 1b. (Optional) Define interface for your command option flags. */
interface MyCommandOptions extends BaseCmdOpts {
  verbose: boolean;
  debug: boolean;
}

/* 2. Pass the argv variable to get the commandInfo object */
const commandInfo: CmdInfo<MyCommandOptions> = cliyargs.getCommandInfo(argv);

// 3. Process the commands
cliyargs.processCommand(commandInfo, (commandName) => {
  // Get the command arguments if needed
  const args = commandInfo.args;

  // Get the command options (flags/switches) if needed
  const options = commandInfo.options;

  // Execute code depending on the provided command
  switch (commandName) {
    case 'init':
      /* See InitCommand class below */
      new InitCommand().run();
      break;

    case 'print':
      /* See PrintCommand class below */
      new PrintCommand().run();
      break;

    case 'list':
      /* See ListCommand class below */
      new ListCommand().run();
      break;
    default:
    /*
     * No command. Handle as you like. You can choose to return an error or process the arguments or options as
     * valid inputs.
     */
  }
});

// ---<InitCommand.ts>---
import { BaseCmd } from 'cliyargs';

class InitCommand extends BaseCmd<MyCommandOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'init' command here
  }
}

// ---</InitCommand.ts>---

// ---<PrintCommand.ts>---
import { BaseCmd } from 'cliyargs';

class PrintCommand extends BaseCmd<MyCommandOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'print' command here
  }
}

// ---</PrintCommand.ts>---

// ---<ListCommand.ts>---
import { BaseCmd } from 'cliyargs';

class ListCommand extends BaseCmd<MyCommandOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'ls' command here
  }
}

// ---</ListCommand.ts>---
```

## cliyargs functions

```typescript

type cliyargs = {
  /**
   * Get the arguments string passed to the cli command for the calling context.
   */
  getCommandArgs(): string;

  /**
   * Parse the argv parameter that is the result of cliyargs.yargs.argv
   * @param argv
   */
  getCommandInfo(argv: any): CmdInfo<T>;

  /**
   * Process the command.
   * @param commandInfo
   * @param processorCb Callback function in which to process the command as preferred.
   */
  processCommand<T extends BaseCmdOpts>(
    commandInfo: CmdInfo<T>,
    processorCb: (commandName: string) => void
  ): void;

  /**
   * Prompt user to enter a string input.
   * @param name Identifier
   * @param message Prompt text shown to the user.
   */
  askInput: (name?: string, message?: string) => Promise<Object>;

  /**
   * Prompt user to select an option from a set of choices.
   * @param name {string} Identifier
   * @param message {string} Prompt text shown to the user.
   * @param choices {string[]} Options to choose from
   * @param multiple {boolean} Whether user can select multiple options
   */
  askSelect: (name?: string, message?: string, choices: any[] = [], multiple?: boolean) => Promise<Object>;

  /**
   * Prompt user to select multiple options from a set of choices.
   * @param name {string} Identifier
   * @param message {string} Prompt text shown to the user.
   * @param choices {string[]} Options to choose from
   */
  askSelectMultiple: (name?: string, message?: string, choices: any[] = []) => Promise<Object>;
};
```

## Interfaces

```typescript
/**
 * This interface should be extended by an interface in the implementing code base to define
 * the contract for each command option switch/flag that can be passed in the cli command.
 */
interface BaseCmdOpts {
  [k: string]: any;
}

interface CmdInfo<T extends BaseCmdOpts> {
  name: string; // The name of a command
  args: string[]; // The arguments passed with the command
  options: T; // The option flags passed with the command
}
```

## Classes

```typescript
/**
 * This class will be extended by a user-defined class to handle one command. There will be one class per command.
 */
abstract class BaseCmd<T extends BaseCmdOpts> {
  args: string[];
  commandInfo: CmdInfo<T>;
  name: string;
  options: T;

  constructor(commandInfo: CmdInfo<T>) {
  }

  getArg(position: number): Stringx {
  }

  run(): Promise<void> {
  }
}
```
