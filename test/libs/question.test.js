import expect from 'expect';
import Question from '../../app/libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["The", "fox", "ran."],
  responses: [
    {
      text: "The fox ran.",
      feedback: "Excellent, that's correct!",
      status: "optimal",
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the following sentences into one sentence.");
    expect(question.sentences).toEqual(["The", "fox", "ran."]);
    expect(question.responses).toBe(data.responses);
  });

  it("should be able to check for an exact match in the responses.", () => {
    var correctResponse = question.checkExactMatch("The fox ran.");
    expect(correctResponse.found).toBe(true);
    var incorrectResponse = question.checkExactMatch("The dog ran.");
    expect(incorrectResponse.found).toBe(false);
  });

  it("should be able to check for an case insensitive match in the responses.", () => {
    var correctResponse = question.checkCaseInsensitiveMatch("the fox ran.");
    expect(correctResponse.found).toBe(true);
    var incorrectResponse = question.checkCaseInsensitiveMatch("the dog ran.");
    expect(incorrectResponse.found).toBe(false);
  });

  it("should be able to check for an punctuation insensitive match in the responses.", () => {
    var correctResponse = question.checkPunctuationInsensitiveMatch("The fox ran");
    expect(correctResponse.found).toBe(true);
    var shoutyResponse = question.checkPunctuationInsensitiveMatch("The fox ran!");
    expect(shoutyResponse.found).toBe(true);
  });

  it("should be able to check for an small typo match in the responses.", () => {
    var oneErrorResponse = question.checkSmallTypoMatch("The fox run.");
    expect(oneErrorResponse.found).toBe(true);
    var twoErrorResponse = question.checkSmallTypoMatch("That fox ran.");
    expect(twoErrorResponse.found).toBe(true);
    var threeErrorResponse = question.checkSmallTypoMatch("The cat ran.");
    expect(threeErrorResponse.found).toBe(false);
    var missingSpaceResponse = question.checkSmallTypoMatch("Thefox ran.");
    expect(missingSpaceResponse.found).toBe(true);
  });

  it("should be able to check for an fuzzy match in the responses.", () => {
    var oneFuzzyResponse = question.checkFuzzyMatch("The fox run.");
    expect(oneFuzzyResponse.found).toBe(true);
    var twoFuzzyResponse = question.checkFuzzyMatch("That fox ran.");
    expect(twoFuzzyResponse.found).toBe(true);
    var threeFuzzyResponse = question.checkFuzzyMatch("The cat ran.");
    expect(threeFuzzyResponse.found).toBe(false);
    var fuzzyMissingSpaceResponse = question.checkFuzzyMatch("Thefox ran.");
    expect(fuzzyMissingSpaceResponse.found).toBe(true);
  });

  it("should be able to check a response and provide info on whats wrong", () => {
    var correctResponse = question.checkMatch("The fox ran.");
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
