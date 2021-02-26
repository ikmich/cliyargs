import { execShellCmd, ICommandInfo, IBaseCmdOptions, Stringx } from './';

export class BaseCmd {
  public commandInfo: ICommandInfo;
  protected name: string;
  protected args: string[] = [];
  protected options: IBaseCmdOptions = {};

  constructor(commandInfo: ICommandInfo) {
    this.commandInfo = commandInfo;
    this.name = commandInfo.name;
    this.args = commandInfo.args;
    this.options = commandInfo.options;
  }

  getArg(position: number): Stringx {
    if (position < 1) position = 1;
    if (position > this.args.length) return null;
    return this.args[position - 1] || '';
  }

  /**
   * Executes actions to run the command.
   */
  async run() {}

  protected async exec(cmd: string): Promise<string> {
    try {
      return await execShellCmd(cmd);
    } catch (e) {
      throw e;
    }
  }
}
