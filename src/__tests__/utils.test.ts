import {conprint, isYesInput, yes} from "../utils";

describe('utils', () => {
  it('checks yes()', () => {
    expect(yes('')).toBe(false);
    expect(yes(89)).toBe(true);
    expect(yes(0)).toBe(true);
  });

  it('checks isYesInput()', () => {
    expect(isYesInput('y')).toBe(true);
    expect(isYesInput('n')).toBe(false);
  })
});

describe('conprint', () => {
  it('checks properties', () => {
    expect(conprint.success).toBeDefined();
    expect(conprint.error).toBeDefined();
    expect(conprint.info).toBeDefined();
    expect(conprint.notice).toBeDefined();
    expect(conprint.plain).toBeDefined();
  });
});
