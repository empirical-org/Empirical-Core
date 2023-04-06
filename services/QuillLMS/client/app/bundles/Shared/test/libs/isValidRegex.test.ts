import * as expect from 'expect';
import { isValidRegex } from '../../../Shared';

describe('#isValidRegex', () => {

  it('returns true if the string passed in is a string with no regex', () => {
    expect(isValidRegex('string')).toEqual(true)
  });

  it('returns true if the string passed in is a string with regex', () => {
    expect(isValidRegex('string|str')).toEqual(true)
  });

  it('returns false if the string passed in contains invalid regex', () => {
    expect(isValidRegex('(string)|(str')).toEqual(false)
  })
});
