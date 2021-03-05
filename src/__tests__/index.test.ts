import { cliyargs } from '../index';
import { MockSTDIN } from 'mock-stdin';

const mockStdin = require('mock-stdin');
let stdin: MockSTDIN | null;

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

  describe('input prompt', () => {
    afterAll(() => {
      stdin?.restore();
    });

    describe('askInput()', () => {
      stdin = mockStdin.stdin();

      it('receives yes/y input', async (done) => {
        cliyargs
          .askInput('input', 'Enter input')
          .then((result) => {
            expect(result).toBe('y');
            done();
          })
          .catch((e) => {
            done(e);
          });

        stdin?.send('y\n');

        cliyargs
          .askInput('input', 'Enter yes input')
          .then((result) => {
            expect(result).toBe('yes');
          })
          .catch((e) => {
            done(e);
          });
        stdin?.send('yes\n');
      });

      it('receives no/n input', async (done) => {
        cliyargs
          .askInput('input', 'Enter no answer')
          .then((result) => {
            expect(result).toBe('no');
            done();
          })
          .catch((e) => {
            done(e);
          });
        stdin?.send('no\n');

        cliyargs
          .askInput('input', 'Enter no answer')
          .then((result) => {
            expect(result).toBe('n');
            done();
          })
          .catch((e) => {
            done(e);
          });
        stdin?.send('n\n');
      });
    });
  });
});
