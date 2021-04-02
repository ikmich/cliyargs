import { IClyCommandInfo, IClyCommandOpts } from '../../index';

export const commandInfoStub: IClyCommandInfo<IClyCommandOpts> = {
  name: 'foo',
  args: ['print', 'ls', 'run'],
  options: {
    output: 'file',
    verbose: true
  }
};
