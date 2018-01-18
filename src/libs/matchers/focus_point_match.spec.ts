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
  const positiveTests = [
    'Jared likes startups.',
    'Jared likes edtech.',
    'Jared likes edtech because he likes startups.',
    'Jared likes edtech and edtech.'
  ];

  const negativeTests = [
    'Jared likes edtech and startups.',
    'Jared likes startups and edtech.',
    'Jared likes startups as well as edtech.',
    'Jared likes startups as well as edtech.'
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
