# Intro

**cliyargs** builds on top of yargs and a few other cli libraries to provide a structured interface for developing
command line applications with NodeJS.

## Usage

```typescript
// 1. Setup your commands
const argv = cliyargs.yargs
  .command('init', 'Initialize parameters')
  .command('print', 'Print out initialization outputs')
  .command('ls', 'List artifacts')
  .help().argv;

// 2. Get the commandInfo
const commandInfo: ICommandInfo = cliyargs.parseArgv(argv);

// 3. Process the commands
cliyargs
  .processCommand(commandInfo, async (commandName) => {
    // Get the command arguments
    const args = commandInfo.args;

    // Get the command options (flags/switches)
    const options = commandInfo.options;

    // Execute code according to the provided command name
    switch (commandName) {
      /* As shown below, 'cliyargs' provides the 'BaseCmd' class that you can extend to define a structured
       * pattern for handling a command. However, You can choose to write code to handle each command according to
       * your own preference.
       */
      case 'init':
        await new InitCommand(commandInfo).run();
        break;
      case 'print':
        await new PrintCommand(commandInfo).run();
        break;
      case 'ls':
        await new LsCommand(commandInfo).run();
        break;
      default:
      /*
       * No command. Handle as you like. You can choose to return an error or process the arguments or options as
       * valid inputs.
       */
    }
  })
  .catch((e) => {
    console.error(e);
  });

// --- InitCommand.ts ----
class InitCommand extends BaseCmd {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'init' command here
  }
}

// --- PrintCommand.ts ----
class PrintCommand extends BaseCmd {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'print' command here
  }
}

// ---- LsCommand.ts ----
class LsCommand extends BaseCmd {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'ls' command here
  }
}
```

## cliyargs functions

```typescript
type T = {
  /**
   * Get the arguments string passed to the cli command for the calling context.
   */
  getCommandArgs(): string;

  /**
   * Parse the argv parameter that is the result of cliyargs.yargs.command().command()...argv
   * @param argv
   */
  parseArgv(argv: any): ICommandInfo;

  /**
   * Process the command.
   * @param commandInfo
   * @param processorCb Callback function to process the command as preferred.
   */
  processCommand(commandInfo: ICommandInfo, processorCb: (commandName: string) => void): Promise<void>;

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
 * the contract for each command option switch/flag that will be used in the cli command.
 */
interface IBaseCmdOptions {
  [k: string]: any;
}

interface ICommandInfo {
  name: string;
  args: string[];
  options: IBaseCmdOptions;
}
```
