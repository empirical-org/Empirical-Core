import expect from 'expect';
import data from '../jsonFromDiagnostic';
import {getIdentificationConceptResult} from '../../app/libs/conceptResultFromSentenceFragment'

describe("Getting concept results from an answered sf object", () => {
  const question = data[0].data;

  it("should have the correct score and concept uids", () => {
    const expected = {
      concept_uid: 'T_Io_fJGN8BZWf_Nb30LBg',
      metadata: {
        correct: 1,
        directions: "Is this a sentence or a fragment?",
        prompt: "Listening to music on the ride home.",
        answer: "Fragment"
      }
    }
    const generated = getIdentificationConceptResult(question)

    expect(generated).toEqual(expected);
  });
})
