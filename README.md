**cliyargs** builds on top of the popular [yargs](https://yargs.js.org/) to provide a class-based structure for
developing command line applications.

## Usage

The following example assumes a cli with the following commands: `init`, `list`, `print`; and the following option
flags: `--verbose` and `--debug`.

##### a) Setup/Bootstrap

```typescript
// Define interface contract for your command option flags.
export interface AppCliOptions extends CliOptions {
  verbose: boolean;
  debug: boolean;
}

// Step 2: Define your cli configuration.
const configuration: CliConfiguration = {
  commands: [
    {
      name: 'init',
      description: 'Initialize parameters'
    },
    {
      name: 'print',
      description: 'Print outputs'
    },
    {
      name: 'list',
      description: 'List artifacts'
    }
  ],
  optionFlags: [
    {
      name: 'verbose',
      alias: 'v',
      description: "Show more info",
      type: 'boolean'
    },
    {
      name: 'debug',
      description: "Enable debugging",
      type: 'boolean'
    },
  ]
};

// Define your command handler function.
const handler: CommandHandler<AppCliOptions> = async (commandInfo: CmdInfo<AppCliOptions>) => {
  switch (commandInfo.name) {
    case 'init':
      // See InitCommand class example further below
      await new InitCommand(commandInfo).run();
      break;
    case 'print':
      // See PrintCommand class example further below
      await new PrintCommand(commandInfo).run();
      break;
    case 'list':
      // See ListCommand class example further below
      await new ListCommand(commandInfo).run();
      break;
  }
};

// Bootstrap!
cliyargs.bootstrap(configuration, handler);
```

##### b) Extend BaseCmd to handle command logic.

Sub-classes of the `BaseCmd` class have access to the command options and arguments, making way for a clean and simple
class-based implementation of your cli application. `cliyargs` offers this class as a convenience, and it is not
compulsory to go this route when using `cliyargs` - you are free to structure your application any way you like.

```typescript
export class InitCommand extends BaseCmd<AppCliOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'init' command here
  }
}

export class ListCommand extends BaseCmd<AppCliOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'list' command here
  }
}

export class PrintCommand extends BaseCmd<AppCliOptions> {
  async run() {
    const options = this.options;
    const args = this.args;
    // Process logic for the 'print' command here
  }
}
```
