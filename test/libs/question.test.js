import expect from 'expect';
import Question from '../../app/libs/question';

describe("The question object", () => {
  const question = new Question("Combine the sentences.",
                                ["The", "fox", "ran."],
                                ["The fox ran."]);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the sentences.");
    expect(question.sentences).toEqual(["The", "fox", "ran."]);
    expect(question.responses).toEqual(["The fox ran."]);
  });

  it("should be able to check for an exact match in the responses.", () => {
    var correctResponse = question.checkExactMatch("The fox ran.");
    expect(correctResponse).toBe(true);
    var incorrectResponse = question.checkExactMatch("The dog ran.");
    expect(incorrectResponse).toBe(false);
  });

  it("should be able to check for an case insensitive match in the responses.", () => {
    var correctResponse = question.checkCaseInsensitiveMatch("the fox ran.");
    expect(correctResponse).toBe(true);
    var incorrectResponse = question.checkCaseInsensitiveMatch("the dog ran.");
    expect(incorrectResponse).toBe(false);
  });

  it("should be able to check for an punctuation insensitive match in the responses.", () => {
    var correctResponse = question.checkPunctuationInsensitiveMatch("The fox ran");
    expect(correctResponse).toBe(true);
    var shoutyResponse = question.checkPunctuationInsensitiveMatch("The fox ran!");
    expect(shoutyResponse).toBe(true);
  });

  it("should be able to check for an small typo match in the responses.", () => {
    var oneErrorResponse = question.checkSmallTypoMatch("The fox run.");
    expect(oneErrorResponse).toBe(true);
    var twoErrorResponse = question.checkSmallTypoMatch("That fox ran.");
    expect(twoErrorResponse).toBe(true);
    var threeErrorResponse = question.checkSmallTypoMatch("The cat ran.");
    expect(threeErrorResponse).toBe(false);
    var missingSpaceResponse = question.checkSmallTypoMatch("Thefox ran.");
    expect(missingSpaceResponse).toBe(true);
  });
})
