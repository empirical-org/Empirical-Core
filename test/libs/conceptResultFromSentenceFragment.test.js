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
      concept_uid: 'j89kdRGDVjG8j37A12p37Q',
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
      concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
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
        concept_uid: 'j89kdRGDVjG8j37A12p37Q',
        metadata: {
          correct: 1,
          directions: "Is this a sentence or a fragment?",
          prompt: "Listening to music on the ride home.",
          answer: "Fragment"
        }
      },
      {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
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
      attempts: [
         {
            "found":true,
            "submitted":"Go away.",
            "posMatch":true,
            "exactMatch":true,
            "response":{
               "conceptResults":{
                  "-KPTKtoxE2UabAeg59Rr":{
                     "conceptUID":"iUE6tekeyep8U385dtmVfQ",
                     "correct":true
                  }
               },
               "count":5,
               "createdAt":"1471534068015",
               "feedback":"<p>Great job! That's a strong sentence.</p>",
               "optimal":true,
               "text":"I am listening to music on the ride home.",
               "weak":false,
               "key":"-KPTFz4xCW3ccaRQs2RI"
            }
         }
      ],
      isFragment: false,
      identified: true,
      prompt: "Is this a sentence?",
      questionText: "Go away.",
    }
    const expected = [{
      concept_uid: 'LH3szu784pXA5k2N9lxgdA',
      metadata: {
        correct: 1,
        directions: "Is this a sentence or a fragment?",
        prompt: "Go away.",
        answer: "Sentence"
      }
    },
    {
      concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
      metadata: {
        correct: 1,
        directions: "Add/change as few words as you can to change this fragment into a sentence",
        prompt: "Go away.",
        answer: "Go away."
      }
    }]
    const generated = getAllSentenceFragmentConceptResults(given)
    expect(generated).toEqual(expected);
  });
})
