import { ICommandInfo } from '../../index';

export const commandInfoStub: ICommandInfo = {
  name: 'foo',
  args: ['print', 'ls', 'run'],
  options: {
    output: 'file',
    verbose: true
  }
};
