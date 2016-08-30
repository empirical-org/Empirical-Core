import expect, { createSpy, spyOn, isSpy } from 'expect';
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
  getAdditionalInlineStyleRangeObject,
  generateStyleObjects
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

  it("should be able to genrate an inline style object for additional words", () => {
    const changeObjects = getChangeObjects(target, user);
    const expected = {
      length: 4,
      offset: 8,
      style: "UNDERLINE"
    }
    expect(getAdditionalInlineStyleRangeObject(target, user)).toEqual(expected)
  });
})

describe("Calling the correct functions for different use cases", () => {
  it("calls getAddtionalInlineStyleRangeObject when it should", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never ever drink soda for it is sugary.";
    const expected = {
      text: user,
      inlineStyleRanges: [{
        length: 4,
        offset: 8,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getInlineStyleRangeObject when it should", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I ner drink soda for it is sugary.";
    const expected = {
      text: user,
      inlineStyleRanges: [{
        length: 3,
        offset: 2,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I drink soda for it is sugary.";
    const expected = {
      text: "I       drink soda for it is sugary.",
      inlineStyleRanges: [{
        length: 5,
        offset: 2,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("returns the default when it should", () => {
    const target = "I never drink soda for it is sugary.";
    const user = "I never drink soda for it is sugary.";
    const expected = {
      text: user,
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "Bill swept the floor while Andy painted the walls.";
    const user = "Bill swept floor while Andy painted the walls.";
    const expected = {
      text: "Bill swept     floor while Andy painted the walls.",
      inlineStyleRanges: [{
        length: 3,
        offset: 11,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "Since it was snowing, Marcella wore a sweater.";
    const user = "Since it was snowing, wore a sweater.";
    const expected = {
      text: "Since it was snowing,          wore a sweater.",
      inlineStyleRanges: [{
        length: 8,
        offset: 22,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "The hazy sky has few clouds.";
    const user = "The hazy sky has few.";
    const expected = {
      text: "The hazy sky has few       .",
      inlineStyleRanges: [{
        length: 6,
        offset: 21,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    console.log("\nStyle objects: ", styleObjects)
    console.log("\nGet change objects: ", getChangeObjects(target, user))
    expect(styleObjects).toEqual(expected)
  })

  it("tags word as incorrect when it should", () => {
    const target = "The hazy sky has few clouds.";
    const user = "The hazy sky has few cloud.";
    const expected = {
      text: "The hazy sky has few cloud.",
      inlineStyleRanges: [{
        length: 5,
        offset: 21,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    console.log("\nStyle objects: ", styleObjects)
    console.log("\nGet change objects: ", getChangeObjects(target, user))
    expect(styleObjects).toEqual(expected)
  })

  it("inserts an underline for a missing comma", () => {
    const target = "Since it was snowing, Marcella wore a sweater.";
    const user = "Since it was snowing Marcella wore a sweater.";
    const expected = {
      text: "Since it was snowing  Marcella wore a sweater.",
      inlineStyleRanges: [{
        length: 1,
        offset: 20,
        style: "UNDERLINE"
      }]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })
})
