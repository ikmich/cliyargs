#!/usr/bin/env node
import { BaseCmd, cliyargs, CmdInfo, BaseCmdOpts } from '../../../index';
const Fs = require('fs');
const Path = require('path');

const outfileName = 'report.json';
const outfile = Path.join(__dirname, outfileName);

const commandInfo: CmdInfo<BaseCmdOpts> = cliyargs.getCommandInfo(
  cliyargs.yargs.command('list', 'List options').command('update', 'Update test-pkg').command('error', 'Run with error')
    .argv
);

export type TestPkgReport = {
  info?: CmdInfo<BaseCmdOpts>;
  commandName?: string;
  error?: any;
};

const report: TestPkgReport = {};

class ListCommand extends BaseCmd<BaseCmdOpts> {
  async run(): Promise<any> {
    await super.run();

    const arg1 = this.getArg(1);
    const arg2 = this.getArg(2);

    console.log({
      msg: 'running list command',
      arg1,
      arg2
    });
  }
}

function writeReport() {
  try {
    let data = JSON.stringify(report, null, 2);
    Fs.writeFileSync(outfile, data);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

const commandArgs = cliyargs.getCommandArgs();
console.log({ commandArgs });

// Process command
cliyargs.processCommand(commandInfo, async (commandName) => {
  switch (commandName) {
    case 'list':
      await new ListCommand(commandInfo).run();
      break;
    case 'error':
      // noinspection ExceptionCaughtLocallyJS
      let error = new Error('Run with error');
      report.error = error;
      writeReport();
      throw error;
  }
  report.info = commandInfo;
  report.commandName = commandName;

  writeReport();
  process.exit(0);
});
