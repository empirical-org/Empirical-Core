import expect from 'expect';
import data from '../jsonFromDiagnostic';
import {
  getConceptResultsForQuestion,
  getNestedConceptResultsForAllQuestions,
  getConceptResultsForAllQuestions,
  embedQuestionNumbers
} from '../../app/libs/conceptResultsFromDiagnostic'

describe("Getting concept results from an answered SC object", () => {
  const questions = data;

  it("can get the results for a single SF question", () => {
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
    ];

    const generated = getConceptResultsForQuestion(data[0])
    expect(expected).toEqual(generated)
  })

  it("can get the results for a single SC question", () => {
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

    const generated = getConceptResultsForQuestion(data[2])
    expect(expected).toEqual(generated)
  })

  it("can get the results for all questions", () => {
    const expected = [
      [
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
      ],
      [{
        concept_uid: 'd3V33ijcTE33QIPIzLa4-Q',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.'
        }
      },
      {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence',
          prompt: 'Go away.'
        }
      }],
      [{
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

    ]

    const generated = getNestedConceptResultsForAllQuestions(data)
    expect(expected).toEqual(generated)
  })

  it("can embed the question numbers ", () => {
    const expected = [
      [
        {
          concept_uid: 'T_Io_fJGN8BZWf_Nb30LBg',
          metadata: {
            correct: 1,
            directions: "Is this a sentence or a fragment?",
            prompt: "Listening to music on the ride home.",
            answer: "Fragment",
            questionNumber: 1
          }
        },
        {
          concept_uid: 'iUE6tekeyep8U385dtmVfQ',
          metadata: {
            correct: 1,
            directions: "Add/change as few words as you can to change this fragment into a sentence",
            prompt: "Listening to music on the ride home.",
            answer: "I am listening to music on the ride home.",
            questionNumber: 1
          }
        }
      ],
      [{
        concept_uid: 'd3V33ijcTE33QIPIzLa4-Q',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.',
          questionNumber: 2
        }
      },
      {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence',
          prompt: 'Go away.',
          questionNumber: 2
        }
      }],
      [{
        concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
        metadata: {
          correct: 1,
          directions: "Combine the sentences.",
          prompt: "It was snowing. Marcella wore a sweater.",
          answer: "Marcella wore a sweater since it was snowing.",
          questionNumber: 3
        }
      },
      {
        concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
        metadata: {
          correct: 1,
          directions: "Combine the sentences.",
          prompt: "It was snowing. Marcella wore a sweater.",
          answer: "Marcella wore a sweater since it was snowing.",
          questionNumber: 3
        }
      }]

    ]

    const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data))
    expect(expected).toEqual(generated)
  })

  it("can embed the flattened array of concept results with embedded question numbers", () => {
    const expected = [
        {
          concept_uid: 'T_Io_fJGN8BZWf_Nb30LBg',
          metadata: {
            correct: 1,
            directions: "Is this a sentence or a fragment?",
            prompt: "Listening to music on the ride home.",
            answer: "Fragment",
            questionNumber: 1
          }
        },
        {
          concept_uid: 'iUE6tekeyep8U385dtmVfQ',
          metadata: {
            correct: 1,
            directions: "Add/change as few words as you can to change this fragment into a sentence",
            prompt: "Listening to music on the ride home.",
            answer: "I am listening to music on the ride home.",
            questionNumber: 1
          }
        },
      {
        concept_uid: 'd3V33ijcTE33QIPIzLa4-Q',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.',
          questionNumber: 2
        }
      },
      {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence',
          prompt: 'Go away.',
          questionNumber: 2
        }
      },{
        concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
        metadata: {
          correct: 1,
          directions: "Combine the sentences.",
          prompt: "It was snowing. Marcella wore a sweater.",
          answer: "Marcella wore a sweater since it was snowing.",
          questionNumber: 3
        }
      },
      {
        concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
        metadata: {
          correct: 1,
          directions: "Combine the sentences.",
          prompt: "It was snowing. Marcella wore a sweater.",
          answer: "Marcella wore a sweater since it was snowing.",
          questionNumber: 3
        }
      }

    ]

    const generated = getConceptResultsForAllQuestions(data)
    expect(expected).toEqual(generated)
  })
});
