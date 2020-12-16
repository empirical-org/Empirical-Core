import * as expect from 'expect'

import preFilters, {
  profanity,
  tooShort,
  multipleSentences,
  tooLong
} from '../../modules/prefilters'

describe('#preFilters', () => {
  it('returns undefined if the string passed in does not match any of the filters', () => {
    expect(preFilters('a perfectly valid response.')).toEqual(undefined)
  });
});

describe("#profanity", () => {
  it('returns matched: true if the string passed in includes profanity', () => {
    expect(profanity('something something something ass.').matched).toEqual(true)
  })

  it('returns matched: false if the string passed in does not include profanity', () => {
    expect(profanity('something something something assumption.').matched).toEqual(false)
  })
})

describe("#tooShort", () => {
  it('returns matched: true if the string passed in is equal to or less than the MINIMUM_WORD_COUNT', () => {
    expect(tooShort('something something.').matched).toEqual(true)
  })

  it('returns matched: false if the string passed in is greater than the MINIMUM_WORD_COUNT', () => {
    expect(tooShort('something something something something.').matched).toEqual(false)
  })
})

describe("#multipleSentences", () => {
  it('returns matched: true if the string passed in includes a period followed by a space that is not one of the known abbreviations', () => {
    expect(multipleSentences('something something something. something').matched).toEqual(true)
  })

  it('returns matched: false if the string passed in does not include a period followed by a space', () => {
    expect(multipleSentences('something something something something.').matched).toEqual(false)
  })

  it('returns matched: false if the string passed in includes a period followed by a space that is one of the known abbreviations', () => {
    expect(multipleSentences('something Dr. Something once told me.').matched).toEqual(false)
  })

  it('returns matched: false if the string passed in includes multiple known and original abbreviations', () => {
    expect(multipleSentences('something Mr. Something and Mrs. Someone once told me.').matched).toEqual(false)
  })

  it('returns matched: false if the string passed in includes an abbreviation at the end of the sentence', () => {
    expect(multipleSentences('because we should follow Martin Luther King Jr.').matched).toEqual(false)
  })
})

describe("#tooLong", () => {
  it('returns matched: true if the string passed in is greater than the MAXIMUM_WORD_COUNT', () => {
    const str = "something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something"
    expect(tooLong(str).matched).toEqual(true)
  })

  it('returns matched: false if the string passed in is less than or equal to the the MAXIMUM_WORD_COUNT', () => {
    expect(tooLong('something something something something.').matched).toEqual(false)
  })
})
