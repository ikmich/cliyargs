import { cliyargs, execShellCmd, ICommandInfo } from '../index';
import { commandInfoStub } from './fixtures';

const Fs = require('fs');
const Path = require('path');
const mockArgv = require('mock-argv');

function readFileJsob(path: string) {
  const contents = Fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(contents);
}

const moduleDir = Path.join(__dirname, './fixtures/test-pkg/');
const modulePath = Path.join(moduleDir, 'index.ts');
const reportPath = Path.join(moduleDir, 'report.json');

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

  it('implements cliyargs', async (done) => {
    async function fn(command: string) {
      await execShellCmd(`ts-node ${modulePath} ${command}`);
      expect(Fs.existsSync(reportPath)).toBe(true);
      const report = readFileJsob(reportPath);
      expect(report.info).toBeDefined();
      expect(report.info.name).toStrictEqual(command);
    }

    await fn('list');
    await fn('update');
    done();
  });

  it('implements cliyargs with args', async (done) => {
    async function fn(command: string, args: string[]) {
      let sargs = args.join(' ');
      await execShellCmd(`ts-node ${modulePath} ${command} ${sargs}`);
      expect(Fs.existsSync(reportPath)).toBe(true);

      const report = readFileJsob(reportPath);
      expect(report).toBeDefined();
      expect(report.info).toBeDefined();

      const info = report.info;
      expect(info.name).toStrictEqual(command);
      expect(Array.isArray(info.args)).toBe(true);
      expect(info.args.length).toBe(Object.keys(args).length);
    }

    await fn('list', ['arg1', 'arg2']);
    done();
  });

  it('implements cliyargs with options/switches', async (done) => {
    async function fn(command: string, args: string[], opts: object) {
      let sargs = args.join(' ');
      let sopts = '';
      Object.entries(opts).forEach(([k, v]) => {
        sopts += `${k} ${v} `;
      });

      await execShellCmd(`ts-node ${modulePath} ${command} ${sargs} ${sopts}`);
      expect(Fs.existsSync(reportPath)).toBe(true);

      const report = readFileJsob(reportPath);
      expect(report).toBeDefined();
      expect(report.info).toBeDefined();

      const info = report.info;
      expect(info.name).toStrictEqual(command);
      expect(Array.isArray(info.args)).toBe(true);
      expect(info.args.length).toBe(Object.keys(args).length);

      expect(info.options).toHaveProperty('verbose', 'true');
      expect(info.options).toHaveProperty('email', 'michfx@gmail.com');
    }

    await fn('update', ['arg1', 'arg2'], {
      '--verbose': true,
      '--email': 'michfx@gmail.com'
    });

    done();
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
