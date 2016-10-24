import expect from 'expect';
import Question from '../../app/libs/diagnosticQuestion';

const data = {
  responses: [
    {
      text: "The fox ran.",
      feedback: "Excellent, that's correct!",
      optimal: true,
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.responses).toBe(data.responses);
  });

  it("should be able to check for an exact match in the responses.", () => {
    var correctResponse = question.checkExactMatch("The fox ran.");
    expect(correctResponse).toExist()
    var incorrectResponse = question.checkExactMatch("The dog ran.");
    expect(incorrectResponse).toNotExist();
  });

  it("should be able to check for an case insensitive match in the responses.", () => {
    var correctResponse = question.checkCaseInsensitiveMatch("the fox ran.");
    expect(correctResponse).toExist()
    var incorrectResponse = question.checkCaseInsensitiveMatch("the dog ran.");
    expect(incorrectResponse).toNotExist();
  });

  it("should be able to check for an punctuation insensitive match in the responses.", () => {
    var correctResponse = question.checkPunctuationInsensitiveMatch("The fox ran");
    expect(correctResponse).toExist()
    var shoutyResponse = question.checkPunctuationInsensitiveMatch("The fox ran!");
    expect(shoutyResponse).toNotExist()
  });

  it("should be able to check for an fuzzy match in the responses.", () => {
    var oneFuzzyResponse = question.checkFuzzyMatch("The fox run.");
    expect(oneFuzzyResponse).toExist()
    // var twoFuzzyResponse = question.checkFuzzyMatch("That fox ran.");
    // expect(twoFuzzyResponse).toExist()
    var threeFuzzyResponse = question.checkFuzzyMatch("The cat ran.");
    expect(threeFuzzyResponse).toNotExist();
    var fuzzyMissingSpaceResponse = question.checkFuzzyMatch("Thefox ran.");
    expect(fuzzyMissingSpaceResponse).toExist()
    var reallyFuzzyMissingSpaceResponse = question.checkFuzzyMatch("Theox ran.");
    expect(reallyFuzzyMissingSpaceResponse).toExist()
  });

  it("should be able to ignore missing whitespace in the responses.", ()=> {
    let correctResponse = question.checkWhiteSpaceMatch("The foxran.");
    expect(correctResponse).toExist();
    let incorrectResponse = question.checkWhiteSpaceMatch("The fax ran.");
    expect(incorrectResponse).toNotExist();
  });

  it("should be able to ignore additional whitespace in the responses.", ()=> {
    let correctResponse = question.checkWhiteSpaceMatch("The fox    ran.");
    expect(correctResponse).toExist();
    let incorrectResponse = question.checkWhiteSpaceMatch("The fax    ran.");
    expect(incorrectResponse).toNotExist();
  });

  it("should be able to ignore whitespace, case, and periods in the responses.", ()=> {
    let correctResponse = question.checkPunctuationAndCaseInsensitiveMatch("The Fox    ran");
    expect(correctResponse).toExist();
    let incorrectResponse = question.checkPunctuationAndCaseInsensitiveMatch("the Fax    ran");
    expect(incorrectResponse).toNotExist();
  });

  const diagsnosticTests = [
    "The fox ran.",
    "THE FOX RAN.",
    "THE fOX RAN",
    "the fox ran",
    "....The fox ran.",
    "thefox ran.",
  ]

  diagsnosticTests.forEach((test, i) => {
    it("should find a match in the responses: " + i, () => {
      expect(
        question.checkPunctuationAndCaseInsensitiveMatch(test)
      ).toExist()
    })
  });

  it("should be able to check a response and provide info on whats wrong", () => {
    var correctResponse = question.checkMatch("The fox ran.");
    expect(correctResponse.typingError).toBe(undefined);
    var correctResponse = question.checkMatch("  The fox ran.  \n"); ///
    expect(correctResponse.typingError).toBe(undefined);
    var caseResponse = question.checkMatch("the fox ran.");
    expect(caseResponse.caseError).toBe(true);
    var punctuationResponse = question.checkMatch("The fox ran");
    expect(punctuationResponse.punctuationError).toBe(true);
    var typoResponse = question.checkMatch("The fox run.");
    expect(typoResponse.typingError).toBe(true);
    var noResponse = question.checkMatch("The dog walked.");
    expect(noResponse.found).toBe(false);
  })
})
