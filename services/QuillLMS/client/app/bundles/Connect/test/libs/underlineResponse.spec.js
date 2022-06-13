import expect, {createSpy, spyOn, isSpy} from 'expect';
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
  generateStyleObjects,
  getImportantStyleRangeObject
} from '../../libs/markupUserResponses.js'

describe("finding the position of the substring", () => {
  const target = "I like NYC.";
  const user = "I liked NYC.";

  it("returns change objects", () => {
    const expected = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: undefined,
        removed: true,
        value: 'like'
      }, {
        count: 1,
        added: true,
        removed: undefined,
        value: 'liked'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    expect(diffWords(target, user)).toEqual(expected);
  });

  it("gets change objects from the library", () => {
    const expected = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: undefined,
        removed: true,
        value: 'like'
      }, {
        count: 1,
        added: true,
        removed: undefined,
        value: 'liked'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    expect(getChangeObjects(target, user)).toEqual(expected);
  })

  it("gets change objects without removed objects", () => {
    const expected = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: true,
        removed: undefined,
        value: 'liked'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    expect(getChangeObjectsWithoutRemoved(target, user)).toEqual(expected);
  })

  it("gets change objects without added objects", () => {
    const expected = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: undefined,
        removed: true,
        value: 'like'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    expect(getChangeObjectsWithoutAdded(target, user)).toEqual(expected);
  })

  it("gets length of first erroneous word added", () => {
    const input = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: true,
        removed: undefined,
        value: 'liked'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    const expected = 5;
    expect(getErroneousWordLength(input, 'added')).toEqual(expected)
  })

  it("gets length of first erroneous word removed", () => {
    const input = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: undefined,
        removed: true,
        value: 'like'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    const expected = 4;
    expect(getErroneousWordLength(input, 'removed')).toEqual(expected)
  })

  it("gets offset of first erroneous word", () => {
    const input = [
      {
        count: 2,
        value: 'I '
      }, {
        count: 1,
        added: true,
        removed: undefined,
        value: 'liked'
      }, {
        count: 3,
        value: ' NYC.'
      }
    ]
    const expected = 2;
    expect(getErroneousWordOffset(input, 'added')).toEqual(expected)
  })

  it("returns a inline style range object with an appropriate length and offset", () => {
    const changeObjects = getChangeObjectsWithoutRemoved(target, user)
    const expected = {
      length: getErroneousWordLength(changeObjects, 'added'),
      offset: getErroneousWordOffset(changeObjects, 'added'),
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
  const changeObjects = getChangeObjectsWithoutRemoved(target, user)
  it("returns a inline style range object", () => {
    const expected = {
      length: getErroneousWordLength(changeObjects, 'added'),
      offset: getErroneousWordOffset(changeObjects, 'added'),
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
  const target = "I never drink soda for it is sugary.";

  it("has nothing to change", () => {
    const user = "I never drink soda for it is sugary.";
    expect(getErrorType(target, user)).toEqual("NO_ERROR");
  })

  it("has an incorrect word", () => {
    const user = "I never drink cider for it is sugary.";
    expect(getErrorType(target, user)).toEqual("INCORRECT_WORD");
  })

  it("has an incorrect word", () => {
    const target = "You don't like to ski, try ice skating."
    const user = "If You dont like to ski, tri ice skating.";
    expect(getErrorType(target, user)).toEqual("INCORRECT_WORD");
  })

  it("has an additional word", () => {
    const user = "I never drink soda for it is too sugary.";
    expect(getErrorType(target, user)).toEqual("ADDITIONAL_WORD");
  })

  it("has a missing word", () => {
    const user = "I never drink for it is sugary.";
    expect(getErrorType(target, user)).toEqual("MISSING_WORD");
  })

  it("has a missing word and an additional word", () => {
    const user = "I never ever drink soda for it sugary.";
    expect(getErrorType(target, user)).toNotEqual("INCORRECT_WORD");
  })
})

describe("Marking up missing words", () => {
  const target = "I never drink soda for it is sugary.";
  const user = "I never soda for it is sugary.";
  const changeObjects = getChangeObjects(target, user);

  it("has a missing word", () => {
    expect(getErrorType(target, user)).toEqual("MISSING_WORD");
  })

  it("should be able to generate a new string with space for underlines.", () => {
    const expected = "I never       soda for it is sugary."
    expect(getMissingWordErrorString(changeObjects)).toEqual(expected);
  });

  it("should be able to generate an inline style object that takes account of the empty space", () => {
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

  it("should be able to generate an inline style object for additional words", () => {
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
  const target = "I never drink soda for it is sugary.";

  it("calls getAddtionalInlineStyleRangeObject when it should", () => {
    const user = "I never ever drink soda for it is sugary.";
    const expected = {
      text: user,
      inlineStyleRanges: [getAdditionalInlineStyleRangeObject(target, user)]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getInlineStyleRangeObject when it should", () => {
    const user = "I ner drink soda for it is sugary.";
    const expected = {
      text: user,
      inlineStyleRanges: [getInlineStyleRangeObject(target, user)]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const user = "I drink soda for it is sugary.";
    const expected = {
      text: "I drink soda for it is sugary.",
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("returns the default when it should", () => {
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
      text: "Bill swept floor while Andy painted the walls.",
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "Since it was snowing, Marcella wore a sweater.";
    const user = "Since it was snowing, wore a sweater.";
    const expected = {
      text: "Since it was snowing, wore a sweater.",
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("calls getMissingInlineStyleRangeObject when it should", () => {
    const target = "The hazy sky has few clouds.";
    const user = "The hazy sky has few.";
    const expected = {
      text: "The hazy sky has few.",
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("tags word as incorrect when it should", () => {
    const target = "The hazy sky has few clouds.";
    const user = "The hazy sky has few cloud.";
    const expected = {
      text: user,
      inlineStyleRanges: [getInlineStyleRangeObject(target, user)]
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })

  it("underlines the previous word for a missing comma", () => {
    const target = "Since it was snowing, Marcella wore a sweater.";
    const user = "Since it was snowing Marcella wore a sweater.";
    const expected = {
      text: user,
      inlineStyleRanges: []
    }
    const styleObjects = generateStyleObjects(target, user)
    expect(styleObjects).toEqual(expected)
  })
})

describe('Underlining when there are multiple errors', () => {
  const target = "I haven't seen an apartment I like yet.";
  const user = "i havent seen a apartment I like yet.";

  it("gets change objects from the library", () => {
    const expected = [
      {
        added: undefined,
        count: 1,
        removed: true,
        value: 'I'
      }, {
        added: true,
        count: 1,
        removed: undefined,
        value: 'i'
      }, {
        count: 1,
        value: ' '
      }, {
        added: undefined,
        count: 3,
        removed: true,
        value: 'haven\'t'
      }, {
        added: true,
        count: 1,
        removed: undefined,
        value: 'havent'
      }, {
        count: 3,
        value: ' seen '
      }, {
        added: undefined,
        count: 1,
        removed: true,
        value: 'an'
      }, {
        added: true,
        count: 1,
        removed: undefined,
        value: 'a'
      }, {
        count: 9,
        value: ' apartment I like yet.'
      }
    ]
    expect(getChangeObjects(target, user)).toEqual(expected);
  })

})


describe('the important flag', ()=>{

  it('responds differently if the error if the generate style object is passed an important flag',()=>{
    const target = "If you don’t like to ski, try ice skating."
    const user = "If you dont like to ski, tr ice skating."
    const withImportant = generateStyleObjects(target, user, true)
    const withOutImportant = generateStyleObjects(target, user, false)
    expect(withImportant).toNotEqual(withOutImportant)
  })

  it('correctly handles underlining when flagged as important', () => {
    const target = "If you don’t like to ski, try ice skating."
    const user = "If you dont like to ski, tr ice skating."
    const expected = {
      "inlineStyleRanges": [
        {
          "length": 2,
          "offset": 24,
          "style": "UNDERLINE"
        }
      ],
      "text": "If you dont like to ski, tr ice skating."
    }
    expect(generateStyleObjects(target, user, true)).toEqual(expected)
  })

})
