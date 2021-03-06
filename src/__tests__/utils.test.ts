import { conprint, isYesInput, no, yes } from '../utils';

describe('utils', () => {
  it('checks yes()', () => {
    expect(yes('')).toBe(false);
    expect(yes(89)).toBe(true);
    expect(yes(0)).toBe(true);
    expect(yes(true)).toBe(true);
  });

  it('checks no()', () => {
    expect(no('')).toBe(true);
    expect(no(false)).toBe(true);
    expect(no('foogma')).toBe(false);
  })

  it('checks isYesInput()', () => {
    expect(isYesInput('y')).toBe(true);
    expect(isYesInput('n')).toBe(false);
  });
});

describe('conprint', () => {
  it('checks properties', () => {
    expect(conprint.success).toBeDefined();
    expect(conprint.error).toBeDefined();
    expect(conprint.info).toBeDefined();
    expect(conprint.notice).toBeDefined();
    expect(conprint.plain).toBeDefined();
  });

  it('runs methods', () => {
    let error:any = null;
    try {
      conprint.success('test conprint success');
      conprint.error('test conprint error');
      conprint.error(new Error('test conprint error object'));
      conprint.info('test conprint info');
      conprint.notice('test conprint notice');
      conprint.plain('test conprint plain');
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
  });
});
