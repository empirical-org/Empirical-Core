import { fillInBlankInputWidth, determineBaseString, } from '../fillInBlankInputWidth';

describe('determineBaseString function', () => {
  it('returns the value when the value is longer than the shortest cue', () => {
    const string = determineBaseString('aaaa', ['a', 'longercue', 'muchlongercue']);
    expect(string).toBe('aaaa');
  });

  it('returns the shortest cue when the shortest cue is longer than the value', () => {
    const string = determineBaseString('a', ['aaaaaa', 'longercue', 'muchlongercue']);
    expect(string).toBe('aaaaaa');
  });

  it('handles empty value and cues array by returning an empty string', () => {
    const string = determineBaseString('', []);
    expect(string).toBe('');
  });

  it('handles null value and cues array by returning an empty string', () => {
    const string = determineBaseString(null, null);
    expect(string).toBe('');
  });
});


describe('fillInBlankInputWidth function', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 500, // arbitrary for tests
    });
  });

  it('calculates width when there is a value and cues', () => {
    const { width, } = fillInBlankInputWidth('aaaa', ['a', 'longercue', 'muchlongercue']);
    expect(width).toBe('520px');
  });

  it('calculates width when value and cues are empty', () => {
    const { width, } = fillInBlankInputWidth('', []);
    expect(width).toBe('520px');
  });

  it('calculates width when value and cues are null', () => {
    const { width, } = fillInBlankInputWidth(null, null);
    expect(width).toBe('520px');
  });
});
