import { cliyargs, execShellCmd } from '../index';
// import { MockSTDIN } from 'mock-stdin';
//
// const mockStdin = require('mock-stdin');
// let stdin: MockSTDIN | null;

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

  it('tests: processCommand()', () => {
    // todo - continue
  });

  it('tests: execShellCmd()', (done) => {
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
});
