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
    var response = question.checkExactMatch("The fox ran.");
    expect(response).toBe(true);
  })
})
