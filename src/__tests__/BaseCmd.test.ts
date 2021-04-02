import { commandInfoStub } from './fixtures';
import { ClyBaseCommand, IClyCommandOpts } from '../index';

class FooCmd extends ClyBaseCommand<IClyCommandOpts> {}

describe('BaseCmd', () => {
  it('should create instance of BaseCmd', async () => {
    let fooCmd = new FooCmd(commandInfoStub);
    expect(fooCmd.getArg).toBeDefined();
    expect(fooCmd.run).toBeDefined();
    expect(fooCmd.commandInfo).toBeDefined();

    expect(fooCmd.getArg(1)).toBe(commandInfoStub.args[0]);
    expect(fooCmd.getArg(0)).toBe(commandInfoStub.args[0]);
    expect(fooCmd.getArg(2)).toBe(commandInfoStub.args[1]);
    expect(fooCmd.getArg(3)).toBe(commandInfoStub.args[2]);
    expect(fooCmd.getArg(5)).toBe(null);

    expect(await fooCmd.run()).toBeUndefined();
  });
});
