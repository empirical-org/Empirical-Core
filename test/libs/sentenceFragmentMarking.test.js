/* global describe, it*/
import expect from 'expect';
import { hashToCollection } from '../../app/libs/hashToCollection.js';
import SFMarkingObj, { wordLengthCount } from '../../app/libs/sentenceFragment';
import responses, {
  optimalResponse,
  subOptimalResponse
} from '../data/sentenceFragmentResponses';
import validEndingPunctuation from '../../app/libs/validEndingPunctuation.js';
import { getGradedResponses } from '../../app/libs/sharedResponseFunctions';

const questionUID = 'mockID';

const fields = {
  prompt: 'Ran to the shop.',
  wordCountChange: { min: 1, max: 2, },
  responses: hashToCollection({optimalResponse, subOptimalResponse}),
  questionUID,
};

const markingObj = new SFMarkingObj(fields);

describe('The Sentence Fragment Marking Object', () => {
  // it('correctly applies passed data to the object', () => {
  //   console.log('Marking obj: ', markingObj, fields);
  //   let objectsMatch = true;
  //   for (const key in markingObj) {
  //     if (markingObj[key] !== fields[key]) {
  //       objectsMatch = false;
  //       break;
  //     }
  //   }
  //   expect(objectsMatch).toBe(true);
  // }); Now fails as the responses are sorted on initialization.

  it('correctly retrieves graded responses', () => {
    const responseLength = getGradedResponses(markingObj.responses).length;
    expect(responseLength).toBe(2);
  });
});

describe('The Sentence Fragment Marking Logic', () => {
  it('can check for an exact match', () => {
    const newResponse = markingObj.checkMatch(optimalResponse.text);
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.parentID).toBe(undefined);
  });

  it('can check for a POS match on optimal responses', () => {
    const newResponse = markingObj.checkMatch('I crawled to the shop.');
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Parts of Speech');
    expect(newResponse.response.optimal).toBe(true);
    expect(newResponse.response.parentID).toBe('optimalResponse');
  });

  it('can check for a POS match on suboptimal responses', () => {
    const newResponse = markingObj.checkMatch('Ran to the shop slowly.');
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Parts of Speech');
    expect(newResponse.response.optimal).toBe(false);
    expect(newResponse.response.parentID).toBe('subOptimalResponse');
  });

  it('cannot return a POS match on ungraded responses', () => {
    const newResponse = markingObj.checkMatch('I piggybacked to the store.');
    expect(newResponse.found).toBe(false);
    expect(newResponse.response.author).toBe(undefined);
    expect(newResponse.response.optimal).toBe(undefined);
    expect(newResponse.response.parentID).toBe(undefined);
  });
});

describe('The min and max word addition matcher', () => {
  it("correctly identifies when a user doesn't add enough words", () => {
    const newResponse = markingObj.checkLengthMatch('Ran to the shop.');
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Short Hint');
  });

  it('correctly identifies when a user adds too many words', () => {
    const newResponse = markingObj.checkLengthMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Long Hint');
  });

  it('returns nothing when a user adds a suitable number of words', () => {
    const newResponse = markingObj.checkLengthMatch('I ran to the shop.');
    expect(newResponse).toBe(undefined);
  });

  it('returns the correct value when called within checkMatch', () => {
    const newResponse = markingObj.checkMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Too Long Hint');
    expect(newResponse.response.optimal).toBe(false);
    expect(newResponse.response.parentID).toBe('optimalResponse');
  });
});

describe('counting the number of words in a string', () => {
  it('correctly counts the number of words and numbers in a string when written correctly.', () => {
    const wordLength = wordLengthCount('Ran to the shop 8 times.');
    expect(wordLength).toBe(6);
  });

  it('correctly counts the number of words in a string when written with bad spacing.', () => {
    const wordLength = wordLengthCount('Ran    to the    shop 8 times.');
    expect(wordLength).toBe(6);
  });

  it('correctly counts the number of words in a string when written with symbols, punctuation and bad spacing.', () => {
    const wordLength = wordLengthCount('Ran,    to @ the   #$%^ shop 8 @#$% times.');
    expect(wordLength).toBe(6);
  });
});

describe('A sentence fragment object without min and max changes', () => {
  const legacyFields = Object.assign({}, fields);
  delete legacyFields.wordCountChange;
  const legacySFMarkingObj = new SFMarkingObj(legacyFields);

  it('should not care how many words are removed', () => {
    const newResponse = legacySFMarkingObj.checkMatch('I.');
    expect(newResponse.found).toBe(false);
  });

  it('should not care how many words are added', () => {
    const newResponse = legacySFMarkingObj.checkMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.found).toBe(false);
  });
});

describe('A sentence fragment object with incomplete min and max changes', () => {
  const partialLengthMarkingObj = new SFMarkingObj(fields);

  it('should still give a hint if it has a min but no max', () => {
    partialLengthMarkingObj.wordCountChange = { min: 1, };
    const newResponse = partialLengthMarkingObj.checkLengthMatch('Ran to the shop.');
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Short Hint');
  });

  it('should still give a hint if it has a max but no min', () => {
    partialLengthMarkingObj.wordCountChange = { max: 3, };
    const newResponse = partialLengthMarkingObj.checkLengthMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Long Hint');
  });
});

describe("A sentence fragment object's ending", () => {
  it('should be marked appropriately if it is missing ending punctuation', () => {
    const newResponse = markingObj.checkEndingPunctuationMatch('I ran to the shop');
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Punctuation End Hint');
  });

  it('should not be marked as improper punctuation if it ends in correct punctation', () => {
    let triggered = false;
    validEndingPunctuation.forEach((validChar) => {
      const newResponse = markingObj.checkEndingPunctuationMatch(`I ran to the shop ${validChar}`);
      if (newResponse !== undefined) {
        triggered = true;
      }
    });
    expect(triggered).toBe(false);
  });
});

describe("A sentence fragment object's beginning", () => {
  it('should be marked appropriately if it starts with a letter that is non-capital', () => {
    const newResponse = markingObj.checkStartingCapitalization('milan is like, the design capital of the world.');
    expect(newResponse.optimal).toBe(false);
  });

  it('should not be marked as improper punctuation if starts with an upper case letter', () => {
    const newResponse = markingObj.checkStartingCapitalization('Milan is like, the design capital of the world.');
    expect(newResponse).toBe(undefined);
  });

  it('should not be marked as improper capitalization if starts with a non-letter', () => {
    let triggered = false;
    const nonLetters = ['!', '4', '@', '/', '.'];
    nonLetters.forEach((nonLetter) => {
      const newResponse = markingObj.checkEndingPunctuationMatch(`${nonLetter}ilan is like, the design capital of the world.`);
      if (newResponse !== undefined) {
        triggered = true;
      }
    });
    expect(triggered).toBe(false);
  });
});
