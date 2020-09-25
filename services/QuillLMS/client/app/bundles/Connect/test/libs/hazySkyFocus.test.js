import expect from 'expect';

import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["The sky has few clouds. The sky is hazy."],
  responses: [
    {
      text: "The hazy sky has few clouds.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "The hazy sky has a few clouds.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "The sky is hazy with a few clouds.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "The sky is hazy with few clouds.",
      feedback: "Excellent, that's correct!",
      optimal: true
    },
    {
      text: "The sky is hazy, with few clouds.",
      feedback: "Excellent, that's correct!",
      optimal: true
    }
  ],
  focusPoints: [
    {
      text: "hazy sky",
      feedback: "How would it sound if you said 'hazy sky'?"
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  const positiveTests = [
    "The sky is hazy, with few clouds.",
    "The sky is hazy with a few clouds.",
    "The sky is hazy, with few clouds.",
    "The cloudy sky is hazy.",
    "The banana sky is hazy."
  ]

  const negativeTests = [
    "The hazy sky has few clouds.",
    "The hazy sky has a few clouds.",
    "The hazy sky has few clouds.",
    "The hazy sky has few bananas.",
  ]

  positiveTests.forEach((test, i) => {
    it("should find a focus point match: " + i, () => {
      expect(
        question.checkFocusPointMatch(test)
      ).toExist()
    })
  });

  negativeTests.forEach((test, i) => {
    it("should not find a focus point match: " + i, () => {
      expect(
        question.checkFocusPointMatch(test)
      ).toNotExist()
    })
  });
})
