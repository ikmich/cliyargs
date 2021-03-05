import { cliyargs } from '../index';
import { MockSTDIN } from 'mock-stdin';

const mockStdin = require('mock-stdin');
let stdin: MockSTDIN | null;

describe('input prompt', () => {
  afterAll(() => {
    stdin?.restore();
  });

  describe('askInput()', () => {
    stdin = mockStdin.stdin();

    it('receives "yes/y" for an answer', async (done) => {
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

    it('receives "no/n" for an answer', async (done) => {
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

  describe('askSelect()', () => {
    stdin = mockStdin.stdin();

    it('receives option as answer', async (done) => {
      cliyargs
        .askSelect('choice', 'Select choice', ['a', 'b', 'c'])
        .then((result) => {
          expect(result).toStrictEqual(['b']);
          done();
        })
        .catch((e) => {
          done(e);
        });
      stdin?.send('2\n');
    });
  });

  describe('askSelectMultiple', () => {
    stdin = mockStdin.stdin();

    it('receives multiple options as answer', async (done) => {
      cliyargs
        .askSelect('choice', 'Select choice', ['a', 'b', 'c', 'd'], true)
        .then((result) => {
          expect(result).toStrictEqual(['b', 'd']);
          done();
        })
        .catch((e) => {
          done(e);
        });
      stdin?.send('2,4\n');
    });
  });
});
