import expect from 'expect';
import { formattedCues } from '../../libs/formattedCues.js';

describe("formattedCues in concept results should change", () => {

  it("a non-empty array of cues into a title-cased list with parenthesis", () => {
    const cues = ['therefore', 'however', 'but'];
    expect(formattedCues(cues)).toEqual('(Therefore, However, But)')
  })

  it("an empty array of cues into an empty string", () => {
    const cues = [];
    expect(formattedCues(cues)).toEqual('')
  })
})
