import {edits} from './edits';

describe('The edits function', () => {
  it('Should take take a word and return potential edits.', () => {
    const potentialEdits = edits("ryan");
    expect(potentialEdits.length).toEqual(367);
  });
});
