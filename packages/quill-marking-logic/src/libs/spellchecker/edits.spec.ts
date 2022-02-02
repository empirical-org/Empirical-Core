import { assert } from 'chai';
import {edits} from './edits';

describe('The edits function', () => {
  it('Should take take a word and return potential edits.', () => {
    const potentialEdits = edits("ryan");
    assert.deepEqual(potentialEdits.length, 367);
  });
});
