import expect from 'expect';
import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["Bill swept the floor. Andy painted the walls."],
  responses: [
    {
      text: "Bill swept the floor while Andy painted the walls.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "Bill swept the floor, and Andy painted the walls.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "While Bill swept the floor, Andy painted the walls.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "Bill swept the floor after Andy painted the walls.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "Bill swept the floor as Andy painted the walls.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "Andy painted the walls while Bill swept the floor.",
      feedback: "Excellent, that's correct!",
      optimal: true
    }

  ]
}

describe("The question object", () => {
  const question = new Question(data);

  const tooShortTests = [
    "Bill swept the floor.",
    "Andy painted the walls.",
    "Bill and Andy did chores..",
  ]

  const tooLongTests = [
    "Bill swept the floor while Andy painted the walls because their Mom told them too.",
    "Andy painted the walls while Bill swept the floor because it was raining outside.",
    "Bill swept the floor, and Andy painted the walls while Sally watched TV.",
  ]

  const inTheMiddleTests = [
    "Andy painted the walls while Bill swept the floor.",
    "Bill swept the floor as Andy painted the walls.",
    "Bill swept the floor, and Andy painted the walls.",
  ]

  tooShortTests.forEach((test, i) => {
    it("should find a too short match in the responses: " + i, () => {
      expect(
        question.checkMinLengthMatch(test)
      ).toExist()
    })
  });

  tooLongTests.forEach((test, i) => {
    it("should find a too long match in the responses: " + i, () => {
      expect(
        question.checkMaxLengthMatch(test)
      ).toExist()
    })
  });

  inTheMiddleTests.forEach((test, i) => {
    it("should not find a too long or too short match in the responses: " + i, () => {
      expect(
        question.checkMaxLengthMatch(test)
      ).toNotExist()
      expect(
        question.checkMinLengthMatch(test)
      ).toNotExist()
    })
  });
})
