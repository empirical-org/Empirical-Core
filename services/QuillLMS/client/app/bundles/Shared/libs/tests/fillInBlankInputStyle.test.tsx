import { fillInBlankInputStyle, determineShortestCue, generateSpan } from '../fillInBlankInputStyle';

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

  it('calculates width when there is a value and cues', () => {
    const { width } = fillInBlankInputStyle('aaaa', ['a', 'longercue', 'muchlongercue'], true);
    expect(width).toBe('60px'); // Mocked 40 for 'aaaa' + 20 padding
  });

  it('calculates width when value and cues are empty', () => {
    const { width } = fillInBlankInputStyle('', []);
    expect(width).toBe('20px'); // Mocked 0 for '' + 20 padding
  });

  it('calculates width when value and cues are null', () => {
    const { width } = fillInBlankInputStyle(null, null, true);
    expect(width).toBe('20px'); // Mocked 0 for null + 20 padding
  });

  it('assigns the textAlign value to center and paddingRight to 10px when the value is shorter than the shortest cue', () => {
    const { textAlign, paddingRight, } = fillInBlankInputStyle('a', ['aaaa', 'longercue', 'muchlongercue'], true);
    expect(textAlign).toBe('center');
    expect(paddingRight).toBe("10px");
  });

  it('assigns the textAlign value to left and paddingRight to 0px when the valueSpan is longer than the shortest cue', () => {
    const { textAlign, paddingRight } = fillInBlankInputStyle('aaaa', ['a', 'longercue', 'muchlongercue'], true);
    expect(textAlign).toBe('left');
    expect(paddingRight).toBe("0px");
  });
});
