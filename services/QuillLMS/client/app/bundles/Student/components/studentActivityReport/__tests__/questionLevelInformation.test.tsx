import * as React from 'react';
import { render, screen } from '@testing-library/react';

import QuestionLevelInformation from '../questionLevelInformation';

const baseQuestion = {
  directions: "Fill in the blank with the correct form of the action word.",
  prompt: "Jason went to the basketball game last night. There, he ___ his sister score thirty points.",
  answer: "Jason went to the basketball game last night. There, he watched his sister score thirty points.",
  score: 100,
  key_target_skill_concept: {
    id: 572,
    uid: "eJbBfgKBpNwuGSvrhIkWOQ",
    name: "Perfect Tense",
    correct: true
  },
  concepts: [
    {
      id: 290,
      name: "Past Tense",
      correct: true,
      feedback: null,
      lastFeedback: null,
      finalAttemptFeedback: "That's a strong sentence!",
      attempt: 1,
      answer: "Jason went to the basketball game last night. There, he watched his sister score thirty points.",
      directions: "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
    }
  ],
  question_number: 1,
  question_uid: "-LY2cegb9T1EdNd7RDlf",
  questionScore: 1
}

describe('QuestionLevelInformation', () => {
  test('renders as expected when the student reached optimal score', () => {
    const { asFragment, } = render(<QuestionLevelInformation question={baseQuestion} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders as expected when the student did not reach an optimal score', () => {
    const suboptimalQuestion = {
      ...baseQuestion,
      questionScore: 0,
      score: 0,
      key_target_skill_concept: { ...baseQuestion.key_target_skill_concept, correct: false, }
    }

    const { asFragment, } = render(<QuestionLevelInformation question={suboptimalQuestion} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders as expected when there are cues in the body of the question hash', () => {
    const questionWithCues = { ...baseQuestion, cues: ["has watched", "watched"] }

    const { asFragment, } = render(<QuestionLevelInformation question={questionWithCues} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders as expected when there are cues in parentheses in the directions text', () => {
    const questionWithCuesInDirections = { ...baseQuestion, directions: "Fill in the blank with the correct form of the action word. (Has watched, Watched)" }

    const { asFragment, } = render(<QuestionLevelInformation question={questionWithCuesInDirections} />)
    expect(asFragment()).toMatchSnapshot()
  })
});
