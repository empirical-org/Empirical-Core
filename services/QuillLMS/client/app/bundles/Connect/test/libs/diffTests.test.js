import expect from 'expect';

import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  responses: [
    {
      text: "The fox ran.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 5
    },
    {
      text: "The fox walked.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      count: 3
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the following sentences into one sentence.");
    expect(question.responses).toBe(data.responses);
  });

  it("should be able to check for an additional word.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The fox ran away.");
    expect(correctResponse).toExist()
  });

  it("should be able to check for an additional word. 2", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The fox away ran.");
    expect(correctResponse).toExist()
  });

  it("should be able to check for an additional word. 3", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The away fox ran.");
    expect(correctResponse).toExist()
  });

  it("should be able to check for a missing word.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The ran.");
    expect(correctResponse).toExist()
  });

  it("should be able to check for a modified word.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The dog ran.");
    expect(correctResponse).toExist()
  });

  it("should be able to check no change.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The fox ran.");
    expect(correctResponse).toExist()
  });

  it("should not match more than one missing word.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The.");
    expect(correctResponse).toNotExist()
  });

  it("should not match more than one additional word.", () => {
    var correctResponse = question.checkChangeObjectRigidMatch("The fleeting fast fox ran.");
    expect(correctResponse).toNotExist()
  });

});
