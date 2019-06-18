require("reify")
const expect = require('expect');
const isValidRegexFile = require('../../src/libs/isValidRegex.ts')

describe('#isValidRegex', () => {

  it('returns true if the string passed in is a string with no regex', () => {
    expect(isValidRegexFile.isValidRegex('string')).toEqual(true)
  });

  it('returns true if the string passed in is a string with regex', () => {
    expect(isValidRegexFile.isValidRegex('string|str')).toEqual(true)
  });

  it('returns false if the string passed in contains invalid regex', () => {
    expect(isValidRegexFile.isValidRegex('(string)|(str')).toEqual(false)
  })
});
