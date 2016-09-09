import expect from 'expect';
import Question from '../../app/libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  responses: [
    {
      text: "Before chocolate is sweetened, it tastes bitter.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 12
    },
    {
      text: "Chocolate tastes bitter before it is sweetened.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 9
    },
    {
      text: "Chocolate tastes bitter before it's sweetened.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 4
    },
    {
      text: "Chocolate tastes bitter before being sweetened.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 1
    },
    {
      text: "Chocolate tastes bitter before sweetened.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 1
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the following sentences into one sentence.");
    expect(question.responses).toBe(data.responses);
  });

  it("should not match really different sentences", () => {
    var correctResponse = question.checkChangeObjectMatch("The completely irrelevent sentences doesn't match.");
    expect(correctResponse).toNotExist()
  });


  it("example 1", () => {
    var correctResponse = question.checkChangeObjectMatch("Chocolate is bitter and it's sweetened.");
    expect(correctResponse).toNotExist()
  });

})
