**cliyargs** builds on top of [yargs](https://yargs.js.org/) to provide a class-based structure for developing command
-line applications.

## Usage

The following example assumes a cli with the following commands: `init`, `list`, `print`; and the following option
flags: `--verbose` and `--debug`.

##### a) Setup/Bootstrap

In your cli project's entrypoint file (the main executable code file which is expected to have `#!/usr/bin/env node` at
the beginning), copy-paste or enter the following setup code sample, and replace parts of it to fit your app's use-case.

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
      description: 'Show more info',
      type: 'boolean'
    },
    {
      name: 'debug',
      description: 'Enable debugging',
      type: 'boolean'
    }
  ]
};

// Define your command handler function.
const handler: CommandHandler<AppCliOptions> = async (commandInfo: CmdInfo<AppCliOptions>) => {
  switch (commandInfo.name) {
    case 'init':
      // Handle the 'init' command...
      break;
    case 'print':
      // Handle the 'print' command...
      break;
    case 'list':
      // Handle the 'list' command...
      break;
  }
};

// Bootstrap!
cliyargs.bootstrap(configuration, handler);
```

Simply implement your app logic accordingly, and you are good to do.

You can go a step further to extend `cliyargs`' recommended class-based structure by creating classes that
extend `BaseCmd`, as described below:

### Extend BaseCmd to handle command logic.

Subclasses of the `BaseCmd` class have access to the command options and arguments, making way for a clean and simple
class-based implementation of your cli application. `cliyargs` offers this class as a convenience, and it is not
required to follow this path when using `cliyargs` - feel free to structure your application any way you like.

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

And then, call the `run()` function of the specific command class accordingly in your `cliyargs` handler function.

```typescript
// Define your command handler function.
const handler: CommandHandler<AppCliOptions> = async (commandInfo: CmdInfo<AppCliOptions>) => {
  switch (commandInfo.name) {
    case 'init':
      await new InitCommand(commandInfo).run();
      break;

    case 'print':
      await new PrintCommand(commandInfo).run();
      break;

    case 'list':
      await new ListCommand(commandInfo).run();
      break;
  }
};
```
