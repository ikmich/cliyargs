import { execShellCmd } from '../index';

const Fs = require('fs');
const Path = require('path');

let moduleDir: string = '';
let modulePath: string = '';
let reportPath: string = '';

function readFileJsob(path: string) {
  const contents = Fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(contents);
}

describe('Module implementation', () => {
  beforeEach(() => {
    moduleDir = Path.join(__dirname, './fixtures/test-pkg/');
    modulePath = Path.join(moduleDir, 'index.ts');
    reportPath = Path.join(moduleDir, 'report.json');
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
});
