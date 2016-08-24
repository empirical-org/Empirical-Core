import expect from 'expect';
import data from '../jsonFromDiagnostic';
import {
  getIdentificationConceptResult,
  getCompleteSentenceConceptResult,
  getAllSentenceFragmentConceptResults
} from '../../app/libs/conceptResultFromSentenceFragment'

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

  it("should label as a complete sentence", () => {
    const expected = {
      concept_uid: 'iUE6tekeyep8U385dtmVfQ',
      metadata: {
        correct: 1,
        directions: "Add/change as few words as you can to change this fragment into a sentence",
        prompt: "Listening to music on the ride home.",
        answer: "I am listening to music on the ride home."
      }
    }
    const generated = getCompleteSentenceConceptResult(question)
    expect(generated).toEqual(expected);
  });

  it("should be able to get all the concept results for a question", () => {
    const expected = [
      {
        concept_uid: 'T_Io_fJGN8BZWf_Nb30LBg',
        metadata: {
          correct: 1,
          directions: "Is this a sentence or a fragment?",
          prompt: "Listening to music on the ride home.",
          answer: "Fragment"
        }
      },
      {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          correct: 1,
          directions: "Add/change as few words as you can to change this fragment into a sentence",
          prompt: "Listening to music on the ride home.",
          answer: "I am listening to music on the ride home."
        }
      }
    ]
    const generated = getAllSentenceFragmentConceptResults(question)
    expect(generated).toEqual(expected);
  })

  it("should not return a complete sentence cr for correctly identified sentences", () => {
    const given = {
      attempts: [],
      isFragment: false,
      identified: true,
      prompt: "Is this a sentence?",
      questionText: "Go away.",
    }
    const expected = [{
      concept_uid: 'd3V33ijcTE33QIPIzLa4-Q',
      metadata: {
        correct: 1,
        directions: "Is this a sentence or a fragment?",
        prompt: "Go away.",
        answer: "Sentence"
      }
    }]
    const generated = getAllSentenceFragmentConceptResults(given)
    expect(generated).toEqual(expected);
  });
})
