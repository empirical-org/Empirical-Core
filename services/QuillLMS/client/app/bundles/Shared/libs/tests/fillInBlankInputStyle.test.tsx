import { fillInBlankInputStyle, } from '../fillInBlankInputStyle';
import * as helpers from '../fillInBlankInputStyleHelpers';

jest.mock('../fillInBlankInputStyleHelpers', () => ({
  ...jest.requireActual('../fillInBlankInputStyleHelpers'),
  generateOffsetWidth: jest.fn(),
}));

const { determineShortestCue, } = helpers

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
    helpers.generateOffsetWidth.mockImplementation((element) => {
      return element.textContent.length * 10;
    });
  });

  it('calculates width when there is a value and cues', () => {
    const { width } = fillInBlankInputStyle('aaaa', ['a', 'longercue', 'muchlongercue']);
    expect(width).toBe('60px'); // Mocked 40 for 'aaaa' + 20 padding
  });

  it('calculates width when value and cues are empty', () => {
    const { width } = fillInBlankInputStyle('', []);
    expect(width).toBe('20px'); // Mocked 0 for '' + 20 padding
  });

  it('calculates width when value and cues are null', () => {
    const { width } = fillInBlankInputStyle(null, null);
    expect(width).toBe('20px'); // Mocked 0 for null + 20 padding
  });

  it('assigns the textAlign value to center and paddingRight to 10px when the value is shorter than the shortest cue', () => {
    const { textAlign, paddingRight, } = fillInBlankInputStyle('a', ['aaaa', 'longercue', 'muchlongercue']);
    expect(textAlign).toBe('center');
    expect(paddingRight).toBe("10px");
  });

  it('assigns the textAlign value to center and paddingRight to 10px when the value is longer than the shortest but the element is shorter than ELEMENT_MIN_WIDTH', () => {
    const { textAlign, paddingRight } = fillInBlankInputStyle('aaaaa', ['a', 'longercue', 'muchlongercue']);
    expect(textAlign).toBe('left');
    expect(paddingRight).toBe("0px");
  });

  it('assigns the textAlign value to left and paddingRight to 0px when the valueSpan is longer than the shortest cue and the element is longer than ELEMENT_MIN_WIDTH', () => {
    const { textAlign, paddingRight } = fillInBlankInputStyle('aaaaaa', ['a', 'longercue', 'muchlongercue']);
    expect(textAlign).toBe('left');
    expect(paddingRight).toBe("0px");
  });
});
