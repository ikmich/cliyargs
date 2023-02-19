import { CmdInfo, CliOptions } from '../../index';

export const commandInfoStub: CmdInfo<CliOptions> = {
  name: 'foo',
  args: ['print', 'ls', 'run'],
  options: {
    output: 'file',
    verbose: true
  }
};
