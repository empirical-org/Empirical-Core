import { fillInBlankInputWidth } from '../fillInBlankInputWidth';

describe('fillInBlankInputWidth function', () => {
  it('calculates width correctly for a value longer than the shortest cue', () => {
    const width = fillInBlankInputWidth('aaaa', ['a', 'longercue', 'muchlongercue']).width;
    expect(width).toBe('70px'); // 'aaaa'.length * 15 + 10 = 70
  });

  it('calculates width correctly for a value shorter than the shortest cue', () => {
    const width = fillInBlankInputWidth('a', ['aaaaaa', 'longercue', 'muchlongercue']).width;
    expect(width).toBe('100px'); // 'aaaaaa'.length * 15 + 10 = 100
  });

  it('handles empty value and cues array correctly', () => {
    const width = fillInBlankInputWidth('', []).width;
    expect(width).toBe('55px'); // 3 (default length if value is empty) * 15 + 10 = 55
  });

  it('handles null value and cues array correctly', () => {
    const width = fillInBlankInputWidth(null, null).width;
    expect(width).toBe('55px'); // 3 (default length if value is empty) * 15 + 10 = 55
  });
});
