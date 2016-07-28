import expect from 'expect';
import {diffWords} from 'diff'
import { getChangeObjects, getChangeObjectsWithoutRemoved, getChangeObjectsWithoutAdded, getErroneousWordLength, getErroneousWordOffset, getInlineStyleRangeObject } from '../../app/libs/markupUserResponses.js'


describe("finding the position of the substring", () => {
  const target = "I like NYC.";
  const user = "I liked NYC.";

  it("returns change objects", () => {
    const expected = [
      { count: 2, value: 'I ' },
      { count: 1, added: undefined, removed: true, value: 'like' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    expect(diffWords(target, user)).toEqual(expected);
  });

  it("gets change objects from the library", () => {
    const expected = [
      { count: 2, value: 'I ' },
      { count: 1, added: undefined, removed: true, value: 'like' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    expect(getChangeObjects(target, user)).toEqual(expected);
  })

  it("gets change objects without removed objects", () => {
    const expected = [
      { count: 2, value: 'I ' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    expect(getChangeObjectsWithoutRemoved(target, user)).toEqual(expected);
  })

  it("gets change objects without added objects", () => {
    const expected = [
      { count: 2, value: 'I ' },
      { count: 1, added: undefined, removed: true, value: 'like' },
      { count: 3, value: ' NYC.' }
    ]
    expect(getChangeObjectsWithoutAdded(target, user)).toEqual(expected);
  })

  it("gets length of first erroneous word", () => {
    const input = [
      { count: 2, value: 'I ' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    const expected = 5;
    expect(getErroneousWordLength(input)).toEqual(expected)
  })

  it("gets offset of first erroneous word", () => {
    const input = [
      { count: 2, value: 'I ' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    const expected = 2;
    expect(getErroneousWordOffset(input)).toEqual(expected)
  })


  it("returns a inline style range object", () => {
    const expected = {
      length: 5,
      offset: 2,
      style: "UNDERLINED"
    }
    expect(getInlineStyleRangeObject(target, user)).toEqual(expected)
  })
});


describe("Returning change objects example 2", () => {
  const target = "I like NYC for it has pizza.";
  const user = "I like NYC because it has pizza.";
  it("returns a inline style range object", () => {
    const expected = {
      length: 7,
      offset: 11,
      style: "UNDERLINED"
    }
    expect(getInlineStyleRangeObject(target, user)).toEqual(expected)
  })
});

describe("Returning change objects example 3: multiple additions", () => {
  const target = "I like NYC for it has pizza.";
  const user = "I like NYC because it had pizza.";
  it("returns a inline style range object", () => {
    const expected = {
      length: 7,
      offset: 11,
      style: "UNDERLINED"
    }
    expect(getInlineStyleRangeObject(target, user)).toEqual(expected)
  })
});
