import { cliyargs } from '../index';
import { MockSTDIN } from 'mock-stdin';

const mockStdin = require('mock-stdin');
let stdin: MockSTDIN | null;

describe('input prompt', () => {
  function prepareStdin() {
    stdin = mockStdin.stdin();
  }

  function restoreStdin() {
    stdin?.restore();
  }

  describe('askInput()', () => {
    it('receives "yes/y" for an answer', async (done) => {
      prepareStdin();
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
      restoreStdin();
    });

    it('receives "no/n" for an answer', async (done) => {
      prepareStdin();
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
          expect(result).toStrictEqual('n');
          done();
        })
        .catch((e) => {
          done(e);
        });
      stdin?.send('n\n');
      restoreStdin();
    });
  });

  describe('askSelect()', () => {
    it('receives option as answer', async (done) => {
      prepareStdin();
      cliyargs
        .askSelect('choice', 'Select choice', ['a', 'b', 'c'])
        .then((result) => {
          expect(result).toStrictEqual('b');
          done();
        })
        .catch((e) => {
          done(e);
        });
      stdin?.send('2\n');
      restoreStdin();
    });

    // it('receives no selection', (done) => {
    //   cliyargs
    //     .askSelect('choice', 'Select choice', ['a', 'b', 'c'])
    //     .then((result) => {
    //       expect(result).toStrictEqual('');
    //       done();
    //     })
    //     .catch((e) => {
    //       done(e);
    //     });
    //   stdin?.send(`0x03\n`);
    // });
  });

  describe('askSelectMultiple', () => {
    it('receives multiple options as answer', async (done) => {
      prepareStdin();
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
      restoreStdin();
    });
  });
});
