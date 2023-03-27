import * as expect from 'expect';
import {
  MULTIPLE_UNNECESSARY_ADDITION, MULTIPLE_UNNECESSARY_DELETION, SINGLE_UNNECESSARY_ADDITION, SINGLE_UNNECESSARY_DELETION, unnecessaryAdditionMatch,
  unnecessaryDeletionMatch, unnecessarySpaceMatch, unnecessarySpaceSplitResponse, UNNECESSARY_SPACE
} from '../../helpers/determineUnnecessaryEditType';

describe('#unnecessarySpaceMatch', () => {
  it('returns matched and the UNNECESSARY_SPACE type if the strings passed in are identical except an extra space', () => {
    const unnecessarySpaceMatchResults = unnecessarySpaceMatch('stringone', 'string one')
    expect(unnecessarySpaceMatchResults.matched).toBe(true)
    expect(unnecessarySpaceMatchResults.unnecessaryEditType).toBe(UNNECESSARY_SPACE)
  });

  it('returns matched: false if the strings passed in are different in some other way', () => {
    expect(unnecessarySpaceMatch('stringone', 'STRING ONE').matched).toBe(false)
  });
});


describe('#unnecessaryAdditionMatch', () => {
  it('returns matched and the MULTIPLE_UNNECESSARY_ADDITION type if the edited string contains multiple extra words', () => {
    const unnecessaryAdditionMatchResults = unnecessaryAdditionMatch('string one', 'string one two three')
    expect(unnecessaryAdditionMatchResults.matched).toBe(true)
    expect(unnecessaryAdditionMatchResults.unnecessaryEditType).toBe(MULTIPLE_UNNECESSARY_ADDITION)
  });

  it('returns matched and the SINGLE_UNNECESSARY_ADDITION type if the edited string contains one extra word', () => {
    const unnecessaryAdditionMatchResults = unnecessaryAdditionMatch('string one', 'string one two')
    expect(unnecessaryAdditionMatchResults.matched).toBe(true)
    expect(unnecessaryAdditionMatchResults.unnecessaryEditType).toBe(SINGLE_UNNECESSARY_ADDITION)
  });

  it('returns matched: false if the strings passed in are different in some other way', () => {
    expect(unnecessaryAdditionMatch('string one', 'STRING ONE').matched).toBe(false)
  });
});

describe('#unnecessaryDeletionMatch', () => {
  it('returns matched and the MULTIPLE_UNNECESSARY_DELETION type if the edited string contains multiple fewer words', () => {
    const unnecessaryDeletionMatchResults = unnecessaryDeletionMatch('string one two three', 'string one')
    expect(unnecessaryDeletionMatchResults.matched).toBe(true)
    expect(unnecessaryDeletionMatchResults.unnecessaryEditType).toBe(MULTIPLE_UNNECESSARY_DELETION)
  });

  it('returns matched and the SINGLE_UNNECESSARY_DELETION type if the edited string contains one fewer word', () => {
    const unnecessaryDeletionMatchResults = unnecessaryDeletionMatch('string one two', 'string one')
    expect(unnecessaryDeletionMatchResults.matched).toBe(true)
    expect(unnecessaryDeletionMatchResults.unnecessaryEditType).toBe(SINGLE_UNNECESSARY_DELETION)
  });

  it('returns matched: false if the strings passed in are different in some other way', () => {
    expect(unnecessaryDeletionMatch('string one', 'STRING ONE').matched).toBe(false)
  });
});

describe('#unnecessarySpaceSplitResponse', () => {
  it('returns an array with the word and an UNNECESSARY_SPACE typed error if the space is in front of the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', ' One')
    const expectedArray = [`{+- |${UNNECESSARY_SPACE}}`, 'One']
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with the word and an UNNECESSARY_SPACE typed error if the space is after the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', 'One ')
    const expectedArray = ['One', `{+- |${UNNECESSARY_SPACE}}`]
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with both parts of the word and an UNNECESSARY_SPACE typed error if the space is in the middle of the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', 'On e')
    const expectedArray = ['On', `{+- |${UNNECESSARY_SPACE}}`, 'e']
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with the word and two UNNECESSARY_SPACE typed errors if there are two spaces before the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', '  One')
    const expectedArray = [`{+- |${UNNECESSARY_SPACE}}`, `{+- |${UNNECESSARY_SPACE}}`, 'One']
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with the word and two UNNECESSARY_SPACE typed errors if there are two spaces after the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', 'One  ')
    const expectedArray = ['One', `{+- |${UNNECESSARY_SPACE}}`, `{+- |${UNNECESSARY_SPACE}}`]
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with the three parts of the word and two UNNECESSARY_SPACE typed errors if there are two spaces in the middle of the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', 'O n e')
    const expectedArray = ['O', `{+- |${UNNECESSARY_SPACE}}`, 'n', `{+- |${UNNECESSARY_SPACE}}`, 'e']
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })

  it('returns an array with both parts of the word and three UNNECESSARY_SPACE typed errors if there are spaces before, after, and in the middle of the word', () => {
    const unnecessarySpaceSplitResponseResults = unnecessarySpaceSplitResponse('One', ' On e ')
    const expectedArray = [`{+- |${UNNECESSARY_SPACE}}`, 'On', `{+- |${UNNECESSARY_SPACE}}`, 'e', `{+- |${UNNECESSARY_SPACE}}`,]
    expect(unnecessarySpaceSplitResponseResults).toEqual(expectedArray)
  })
})
