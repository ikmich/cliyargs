import { BaseCmd } from '../BaseCmd';
import { commandInfoStub } from './fixtures';

class FooCmd extends BaseCmd {}

describe('BaseCmd', () => {
  it('should create instance of BaseCmd', () => {
    let fooCmd = new FooCmd(commandInfoStub);
    expect(fooCmd.getArg).toBeDefined();
    expect(fooCmd.run).toBeDefined();
    expect(fooCmd.commandInfo).toBeDefined();
  });
});
