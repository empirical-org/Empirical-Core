import * as expect from 'expect'
import determineUnnecessaryEditType, {
  UNNECESSARY_SPACE,
  MULTIPLE_UNNECESSARY_DELETION,
  SINGLE_UNNECESSARY_DELETION,
  MULTIPLE_UNNECESSARY_ADDITION,
  SINGLE_UNNECESSARY_ADDITION,
  UNNECESSARY_CHANGE,
  unnecessarySpaceMatch,
  unnecessaryAdditionMatch,
  unnecessaryDeletionMatch
} from '../../helpers/determineUnnecessaryEditType'

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
