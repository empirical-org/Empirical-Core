import expect from 'expect';

import Question from '../../libs/question';

const data = {
  prompt: "Combine the following sentences into one sentence.",
  sentences: ["The earth's crust is made up of plates. The plates are huge. The plates fit together. They fit like a jigsaw."],
  responses: [
    {
      text: "The earth's crust is made up of huge plates that fit together like a jigsaw.",
      feedback: "Excellent, that's correct!",
      status: "optimal",
    }
  ]
}

describe("The question object", () => {
  const question = new Question(data);

  const existTests = [
    "The earth's crust is made up of huge plates that fit together like a jigsaw.",
    "The earth's crust is made up of huge plats that fit together like a jigsaw.",
    "The earth's crust is made up of huge plate that fit together like a jigsaw.",
  ]

  const notExistTests = [
    "The earth's crust is made up of huge plates that fit together like a a jigsaw.",
    "The earth's crust is made up of huge plates, and they fit together like a jigsaw puzzle.",
    "The earth's crust is made up of huge plates, the plates are huge, fit together and they fit like a jigsaw puzzle.",
    "The earth's crust is made up of plates, the plates are huge, the plates fit together, they fit like a jigsaw.",
    "The earth's crust is made up of plates, he plates are huge, the plates fit together, they fit like a jigsaw.",
    "The earth's crust is made up of large plates that fit together like a jig saw.",
    "The earth's crust is made up of plates and the plates are huge and the plates fit together and they fit like a jigsaw."
  ]

  existTests.forEach((test, i) => {
    it(" earth should find a fuzzy match in the responses: " + i, () => {
      expect(
        question.checkFuzzyMatch(test)
      ).toExist()
    })
  });

  notExistTests.forEach((test, i) => {
    it(" earth should not find a fuzzy match in the responses: " + i, () => {
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
