import {assert} from 'chai';
import {focusPointMatch} from './focus_point_match';
import {Response, FocusPoint} from '../../interfaces'

const focusPoints = [
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
]

describe('The Jared question object', () => {
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
      assert.ok(focusPointMatch(test, focusPoints))
    });
  });

  negativeTests.forEach((test, i) => {
    it(`should not find a focus point match: ${i}`, () => {
      assert.notOk(focusPointMatch(test, focusPoints));
    });
  });
});
