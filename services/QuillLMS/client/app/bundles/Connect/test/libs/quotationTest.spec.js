import expect from 'expect';
import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["Frida Kahlo’s childhood home is called “The Blue House.” It is painted a bright cobalt blue."],
  responses: [
    {
      text: "Frida Kahlo’s childhood home is called “The Blue House” because it is painted a bright cobalt blue.",
      feedback: "Excellent, that's correct!",
      optimal: true,
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the following sentences into one sentence.");
    expect(question.sentences).toEqual(["Frida Kahlo’s childhood home is called “The Blue House.” It is painted a bright cobalt blue."]);
    expect(question.responses).toBe(data.responses);
  });

  it("should be able to check for an exact match in the responses.", () => {
    let correctResponse = question.checkExactMatch("Frida Kahlo’s childhood home is called “The Blue House” because it is painted a bright cobalt blue.");
    expect(correctResponse).toExist()
    let alternateQuotationResponse = question.checkExactMatch("Frida Kahlo’s childhood home is called \"The Blue House\" because it is painted a bright cobalt blue.");
    expect(alternateQuotationResponse).toExist();
  });

  it("should be able to check for an exact match in the responses.", () => {
    let correctResponse = question.checkExactMatch("Frida Kahlo’s childhood home is called “The Blue House” because it is painted a bright cobalt blue.");
    expect(correctResponse).toExist()
    let alternateQuotationResponse = question.checkExactMatch("Frida Kahlo's childhood home is called \"The Blue House\" because it is painted a bright cobalt blue.");
    expect(alternateQuotationResponse).toExist();
  });
});
