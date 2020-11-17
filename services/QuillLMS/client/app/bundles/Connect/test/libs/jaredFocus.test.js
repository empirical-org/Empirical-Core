import expect from 'expect';
import Question from '../../libs/question';

const data = {
  prompt: 'Combine the following sentences into one sentence.',
  sentences: ['Jared likes Edtech. Jared likes startups.'],
  responses: [
    {
      text: 'Jared likes Edtech and startups.',
      feedback: "Excellent, that's correct!",
      optimal: true,
    },
    {
      text: 'Jared likes startups and Edtech.',
      feedback: "Excellent, that's correct!",
      optimal: true,
    }
  ],
  focusPoints: [
    {
      text: 'edtech',
      feedback: "What's that thing with computers and school he likes?",
    },
    {
      text: 'and|||as well as',
      feedback: "What's a word that shows he likes two things?",
    },
    {
      text: 'startups',
      feedback: "What's that thing with computers and school he likes?",
    }
  ],
};

describe('The Jared question object', () => {
  const question = new Question(data);

  const negativeTests = [
    'Jared likes Edtech and startups.',
    'Jared likes startups and Edtech.',
    'Jared likes startups as well as Edtech.',
    'Jared likes startups as well as Edtech.'
  ];

  const positiveTests = [
    'Jared likes startups.',
    'Jared likes Edtech.',
    'Jared likes Edtech because he likes startups.',
    'Jared likes Edtech and Edtech.'
  ];

  positiveTests.forEach((test, i) => {
    it(`should find a focus point match: ${i}`, () => {
      expect(
        question.checkFocusPointMatch(test)
      ).toExist();
    });
  });

  negativeTests.forEach((test, i) => {
    it(`should not find a focus point match: ${i}`, () => {
      expect(
        question.checkFocusPointMatch(test)
      ).toNotExist();
    });
  });
});
