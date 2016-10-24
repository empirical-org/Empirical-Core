import expect from 'expect';
import data from '../jsonFromDiagnostic';
import {
  getConceptResultsForSentenceCombining
} from '../../app/libs/conceptResults/sentenceCombining'

describe("Getting concept results from an answered SC object", () => {
  const question = data[2].data;

  it("should have the correct score and concept uids", () => {
    const expected = [{
      concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
      metadata: {
        correct: 1,
        directions: "Combine the sentences.",
        prompt: "It was snowing. Marcella wore a sweater.",
        answer: "Marcella wore a sweater since it was snowing."
      }
    },
    {
      concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
      metadata: {
        correct: 1,
        directions: "Combine the sentences.",
        prompt: "It was snowing. Marcella wore a sweater.",
        answer: "Marcella wore a sweater since it was snowing."
      }
    }]
    const generated = getConceptResultsForSentenceCombining(question)

    expect(generated).toEqual(expected);
  });
});
