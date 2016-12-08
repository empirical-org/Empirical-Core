import expect from 'expect';
import Question from '../../app/libs/diagnosticQuestion';

const data = {
  responses: [
    {
      text: 'The fox ran.',
      feedback: "Excellent, that's correct!",
      optimal: true,
    },
    {
      author: 'Modified Word Hint',
      count: 1,
      feedback: 'Revise your work. You may have mixed up a word.',
      parentID: undefined,
      questionUID: undefined,
      text: 'The dog crawled.',
    }
  ],
};

describe('The question object', () => {
  const question = new Question(data);

  it('should be initialized with a prompt, sentence fragments and responses.', () => {
    expect(question.responses).toBe(data.responses);
  });

  it('should be able to check for an exact match in the responses.', () => {
    const correctResponse = question.checkExactMatch('The fox ran.');
    expect(correctResponse).toExist();
    const incorrectResponse = question.checkExactMatch('The dog ran.');
    expect(incorrectResponse).toNotExist();
  });

  it('should be able to check for an case insensitive match in the responses.', () => {
    const correctResponse = question.checkCaseInsensitiveMatch('the fox ran.');
    expect(correctResponse).toExist();
    const incorrectResponse = question.checkCaseInsensitiveMatch('the dog ran.');
    expect(incorrectResponse).toNotExist();
  });

  it('should be able to check for an punctuation insensitive match in the responses.', () => {
    const correctResponse = question.checkPunctuationInsensitiveMatch('The fox ran');
    expect(correctResponse).toExist();
    const shoutyResponse = question.checkPunctuationInsensitiveMatch('The fox ran!');
    expect(shoutyResponse).toNotExist();
  });

  it('should be able to check for an fuzzy match in the responses.', () => {
    const oneFuzzyResponse = question.checkFuzzyMatch('The fox run.');
    expect(oneFuzzyResponse).toExist();
    // var twoFuzzyResponse = question.checkFuzzyMatch("That fox ran.");
    // expect(twoFuzzyResponse).toExist()
    const threeFuzzyResponse = question.checkFuzzyMatch('The cat ran.');
    expect(threeFuzzyResponse).toNotExist();
    const fuzzyMissingSpaceResponse = question.checkFuzzyMatch('Thefox ran.');
    expect(fuzzyMissingSpaceResponse).toExist();
    const reallyFuzzyMissingSpaceResponse = question.checkFuzzyMatch('Theox ran.');
    expect(reallyFuzzyMissingSpaceResponse).toExist();
  });

  it('should be able to ignore missing whitespace in the responses.', () => {
    const correctResponse = question.checkWhiteSpaceMatch('The foxran.');
    expect(correctResponse).toExist();
    const incorrectResponse = question.checkWhiteSpaceMatch('The fax ran.');
    expect(incorrectResponse).toNotExist();
  });

  it('should be able to ignore additional whitespace in the responses.', () => {
    const correctResponse = question.checkWhiteSpaceMatch('The fox    ran.');
    expect(correctResponse).toExist();
    const incorrectResponse = question.checkWhiteSpaceMatch('The fax    ran.');
    expect(incorrectResponse).toNotExist();
  });

  it('should be able to ignore whitespace, case, and periods in the responses.', () => {
    const correctResponse = question.checkPunctuationAndCaseInsensitiveMatch('The Fox    ran');
    expect(correctResponse).toExist();
    const incorrectResponse = question.checkPunctuationAndCaseInsensitiveMatch('the Fax    ran');
    expect(incorrectResponse).toNotExist();
  });

  const diagsnosticTests = [
    'The fox ran.',
    'THE FOX RAN.',
    'THE fOX RAN',
    'the fox ran',
    '....The fox ran.',
    'thefox ran.'
  ];

  diagsnosticTests.forEach((test, i) => {
    it(`should find a match in the responses: ${i}`, () => {
      expect(
        question.checkPunctuationAndCaseInsensitiveMatch(test)
      ).toExist();
    });
  });

  it('should be able to check a response and provide info on whats wrong', () => {
    const caseResponse = question.checkMatch('the fox ran.');
    expect(caseResponse.response.author).toBe('Capitalization Hint');
    const punctuationResponse = question.checkMatch('The fox ran');
    expect(punctuationResponse.response.author).toBe('Punctuation Hint');
    const typoResponse = question.checkMatch('The fox run.');
    expect(typoResponse.response.author).toBe('Modified Word Hint');
    const noResponse = question.checkMatch('The dog walked.');
    expect(noResponse.found).toBe(true);
  });

  it('should be able to check against sub optimal answers', () => {
    const exactMatch = question.checkMatch(data.responses[1].text);
    expect(exactMatch.found).toBe(true);
    expect(exactMatch.response.optimal).toBe(data.responses[1].optimal);
    const typoSubOptimal = question.checkMatch('The dog crawled.');
    expect(typoSubOptimal.found).toBe(true);
    expect(typoSubOptimal.response).toBe(data.responses[1]);
  });
});
