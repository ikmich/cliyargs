# Intro

**cliyargs** builds on top of yargs and a few other cli libraries to provide a structured interface for developing
command line applications with NodeJS.

# Usage
```typescript
/*
 1. Setup your commands
 */
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
    const args = commandInfo.args
    
    // Get the command options (flags/switches)
    const options = commandInfo.options;
    
    // Execute code according to the provided command name
    switch (commandName) {
      case 'init':
        await new InitCommand(commandInfo).run();
        break;
      case 'print':
        await new UseCommand(commandInfo).run();
        break;
      case 'ls':
        // handle 
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
```

