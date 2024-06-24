import { fillInBlankInputStyle, determineShortestCue, } from '../fillInBlankInputStyle';

describe('determineShortestCue function', () => {
  it('returns the shortest cue from a list of cues', () => {
    const shortest = determineShortestCue(['aaa', 'a', 'aa']);
    expect(shortest).toBe('a');
  });

  it('returns an empty string if cues array is empty', () => {
    const shortest = determineShortestCue([]);
    expect(shortest).toBe('');
  });

  it('returns an empty string if cues is null', () => {
    const shortest = determineShortestCue(null);
    expect(shortest).toBe('');
  });

  it('handles array with one cue', () => {
    const shortest = determineShortestCue(['only']);
    expect(shortest).toBe('only');
  });

});


describe('fillInBlankInputStyle function', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 500, // arbitrary for tests
    });
  });

  it('calculates width when there is a value and cues', () => {
    const { width, } = fillInBlankInputStyle('aaaa', ['a', 'longercue', 'muchlongercue']);
    expect(width).toBe('520px');
  });

  it('calculates width when value and cues are empty', () => {
    const { width, } = fillInBlankInputStyle('', []);
    expect(width).toBe('520px');
  });

  it('calculates width when value and cues are null', () => {
    const { width, } = fillInBlankInputStyle(null, null);
    expect(width).toBe('520px');
  });

  it('assigns the textAlign value to center when the value is shorter than the shortest cue', () => {
    const { textAlign, } = fillInBlankInputStyle('a', ['aaaa', 'longercue', 'muchlongercue']);
    expect(textAlign).toBe('center');
  })

  it('assigns the textAlign value to left when the valueSpan is longer than the shortest cue', () => {
    const { textAlign, } = fillInBlankInputStyle('aaaa', ['a', 'longercue', 'muchlongercue']);
    expect(textAlign).toBe('left');
  })

});
