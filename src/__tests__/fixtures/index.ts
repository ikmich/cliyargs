import { CmdInfo, BaseCmdOpts } from '../../index';

export const commandInfoStub: CmdInfo<BaseCmdOpts> = {
  name: 'foo',
  args: ['print', 'ls', 'run'],
  options: {
    output: 'file',
    verbose: true
  }
};
