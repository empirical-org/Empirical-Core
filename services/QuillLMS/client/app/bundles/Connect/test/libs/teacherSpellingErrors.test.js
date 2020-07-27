import expect from 'expect';
import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["The woman is the teacher. The woman is in the next room."],
  responses: [
    {
      text: "The woman in the next room is the teacher.",
      feedback: "Excellent, that's correct!",
      status: "optimal",
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  it("should be initialized with a prompt, sentence fragments and responses.", () => {
    expect(question.prompt).toEqual("Combine the following sentences into one sentence.");
    expect(question.sentences).toEqual(["The woman is the teacher. The woman is in the next room."]);
    expect(question.responses).toBe(data.responses);
  });

  const existTests = [
    "The woman in the next room is the teacher.",
    "That woman in the next room is the teacher.",
    "Thewoman in the next room is the teacher."
  ]

  const notExistTests = [
    "The woman in the next room is a teacher. She is the teacher.",
    "The woman in the next room is who the teacher is.",
    "The woman in the next room is a teacher. The woman is the teacher.",
    "The woman is in the next room who is the teacher.",
    "The woman in the next room is teacher.",
    "The woman is in the next room, The woman is the teacher."
  ]

  existTests.forEach((test, i) => {
    it(" woman should find a fuzzy match in the responses: " + i, () => {
      expect(
        question.checkFuzzyMatch(test)
      ).toExist()
    })
  });

  notExistTests.forEach((test, i) => {
    it(" woman should not find a fuzzy match in the responses: " + i, () => {
      expect(
        question.checkFuzzyMatch(test)
      ).toNotExist()
    })
  });

  // existTests.forEach((test, i) => {
  //   it("should find a small typo match in the responses: " + i, () => {
  //     expect(
  //       question.checkSmallTypoMatch(test)
  //     ).toExist()
  //   })
  // });
  //
  // notExistTests.forEach((test, i) => {
  //   it("should not find a small typo match in the responses: " + i, () => {
  //     expect(
  //       question.checkSmallTypoMatch(test)
  //     ).toNotExist()
  //   })
  // });
})
