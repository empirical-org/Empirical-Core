import {checkSentenceCombining} from './sentence_combining'
import {Response} from '../../interfaces'

describe('The checking a sentence combining question', () => {
  const savedResponses: Array<Response> = [
    {
      id: 1,
      text: "My dog took a nap.",
      feedback: "Good job, that's a sentence!",
      optimal: true,
      count: 1,
      question_uid: 'questionOne'
    },
    {
      id: 2,
      text: "My cat took a nap.",
      feedback: "The animal woofs so try again!",
      optimal: false,
      count: 1,
      question_uid: 'questionOne'
    }
  ]

  it('it should be able to grade it.', () => {
    const responseString: string = "My dog took a nap.";
    const matchedResponse = checkSentenceCombining('questionOne', responseString, savedResponses, null, null);
    expect(matchedResponse.id).toEqual(savedResponses[0].id);
  });

  it('it should be able to grade it even with trailing spaces.', () => {
    const responseString: string = "My dog took a nap. ";
    const matchedResponse = checkSentenceCombining('questionOne', responseString, savedResponses, null, null);
    expect(matchedResponse.id).toEqual(savedResponses[0].id);
  });

  it('it should be able to grade it with spelling errors.', () => {
    const responseString: string = "My dg took a nap.";
    expect(checkSentenceCombining('questionOne', responseString, savedResponses, null, null)).toBeTruthy()
  });

  it('it should be able to grade it with spelling and punctuation errors.', () => {
    const responseString: string = "My dg took a nap";

    expect(checkSentenceCombining('questionOne', responseString, savedResponses, null, null)).toBeTruthy()
  });
});
