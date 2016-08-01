import expect from 'expect';
import {diffWords} from 'diff'
import {
  getChangeObjects,
  getChangeObjectsWithoutRemoved,
  getChangeObjectsWithoutAdded,
  getErroneousWordLength,
  getErroneousWordOffset,
  getInlineStyleRangeObject,
  getErrorType,
  getMissingWordErrorString,
  getMissingInlineStyleRangeObject,
  getAddtionalInlineStyleRangeObject
} from '../../app/libs/markupUserResponses.js'


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
    expect(getErroneousWordLength(input, 'added')).toEqual(expected)
  })

  it("gets offset of first erroneous word", () => {
    const input = [
      { count: 2, value: 'I ' },
      { count: 1, added: true, removed: undefined, value: 'liked' },
      { count: 3, value: ' NYC.' }
    ]
    const expected = 2;
    expect(getErroneousWordOffset(input, 'added')).toEqual(expected)
  })


  it("returns a inline style range object", () => {
    const expected = {
      length: 5,
      offset: 2,
      style: "UNDERLINE"
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
      style: "UNDERLINE"
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
      style: "UNDERLINE"
    }
    expect(getInlineStyleRangeObject(target, user)).toEqual(expected)
  })
});

describe("Returning change objects example 4", () => {
  const target = "I never drink soda for it is sugary.";
  const user = "I never drank soda for it is sugary.";
  it("returns a inline style range object", () => {
    const expected = {
      length: 5,
      offset: 8,
      style: "UNDERLINE"
    }
    expect(getInlineStyleRangeObject(target, user)).toEqual(expected)
  })
});

describe("Cases for diff outcomes", () => {
  it("has nothing to change", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never drink soda for it is sugary.";
    expect(getErrorType(target, user)).toEqual("NO_ERROR");
  })

  it("has an additional word", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never drink soda for it is too sugary.";
    expect(getErrorType(target, user)).toEqual("ADDITIONAL_WORD");
  })

  it("has a missing word", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never drink for it is sugary.";
    expect(getErrorType(target, user)).toEqual("MISSING_WORD");
  })

  it("has an incorrect word", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never drink cider for it is sugary.";
    expect(getErrorType(target, user)).toEqual("INCORRECT_WORD");
  })

  it("has a missing word and an additional word", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never ever drink soda for it sugary.";
    expect(getErrorType(target, user)).toNotEqual("INCORRECT_WORD");
  })
})

describe("Marking up missing words", () => {
  const target = "I never drink soda for it is sugary.";
  const user = "I never soda for it is sugary.";
  it("has a missing word", () => {
    expect(getErrorType(target, user)).toEqual("MISSING_WORD");
  })

  it("should be able to genrate a new string with space for underlines.", () => {
    const changeObjects = getChangeObjects(target, user);
    const expected = "I never       soda for it is sugary."
    expect(getMissingWordErrorString(changeObjects)).toEqual(expected);
  });

  it("should be able to genrate an inline style object that takes account of the empty space", () => {
    const changeObjects = getChangeObjects(target, user);
    const expected = {
      length: 5,
      offset: 8,
      style: "UNDERLINE"
    }
    expect(getMissingInlineStyleRangeObject(target, user)).toEqual(expected)
  });
})

describe("Marking up added words", () => {
  const target = "I never drink soda for it is sugary.";
  const user = "I never ever drink soda for it is sugary.";
  it("has a added word", () => {
    expect(getErrorType(target, user)).toEqual("ADDITIONAL_WORD");
  })

  it("should be able to genrate an inline style object that takes account of the empty space", () => {
    const changeObjects = getChangeObjects(target, user);
    const expected = {
      length: 4,
      offset: 8,
      style: "UNDERLINE"
    }
    expect(getAddtionalInlineStyleRangeObject(target, user)).toEqual(expected)
  });
})
