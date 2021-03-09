import { cliyargs, execShellCmd, ICommandInfo } from '../index';
import { commandInfoStub } from './fixtures';

const mockArgv = require('mock-argv');

describe('cliyargs', () => {
  it('should be defined', () => {
    expect(cliyargs).toBeDefined();
  });

  it('should have expected properties', () => {
    expect(cliyargs).toHaveProperty('askInput');
    expect(cliyargs).toHaveProperty('askSelect');
    expect(cliyargs).toHaveProperty('askSelectMultiple');
    expect(cliyargs).toHaveProperty('yargs');
    expect(cliyargs).toHaveProperty('getCommandArgs');
    expect(cliyargs).toHaveProperty('parseArgv');
    expect(cliyargs).toHaveProperty('processCommand');
  });

  describe('processCommand()', () => {
    it('works', (done) => {
      const expectedCommand = 'fixit';
      let processorCb = (commandName: string) => {
        expect(commandName).toBe(expectedCommand);
        done();
      };

      let info = Object.assign({}, commandInfoStub, {
        name: expectedCommand
      });

      cliyargs.processCommand(info, processorCb);
    });
  });

  describe('execShellCmd()', () => {
    it('works', (done) => {
      execShellCmd('echo foo')
        .then((result) => {
          expect(typeof result).toBe('string');
          expect(result).toBe('foo\n');
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it('works with stderr', (done) => {
      expect(execShellCmd('xyzed'))
        .rejects.toBeDefined()
        .finally(() => {
          done();
        });
    });
  });

  describe('parseArgv()', () => {
    it('works', (done) => {
      const argv = cliyargs.yargs(['list', '--verbose=true']).argv;
      const cmdInfo: ICommandInfo = cliyargs.parseArgv(argv);
      expect(cmdInfo.name).toStrictEqual('list');
      expect(cmdInfo.options).toHaveProperty('verbose', 'true');
      done();
    });

    it('tests for !argv', () => {
      const cmdInfo: ICommandInfo = cliyargs.parseArgv(null);
      expect(cmdInfo.name).toBe('');
    });
  });

  it('tests: getCommandArgs()', () => {
    mockArgv(['foo', 'bar', '--verbose=true'], () => {
      const result = cliyargs.getCommandArgs();
      expect(result).toStrictEqual('foo bar --verbose=true');
    });
  });
});
