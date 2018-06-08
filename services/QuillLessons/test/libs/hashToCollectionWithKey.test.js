import expect from 'expect';
import {embedKeys, hashToCollection} from '../../app/libs/hashToCollection.js';

describe("Turning a hash into a collection with embedded keys", () => {
  const hash = {
    one: {
      value: "one"
    },
    two: {
      value: "two"
    }
  }

  it("should map the values to embed the key", () => {
    var expected = {
      one: {
        value: "one",
        key: "one"
      },
      two: {
        value: "two",
        key: "two"
      }
    }
    expect(embedKeys(hash).one.key).toEqual(expected.one.key);
    expect(embedKeys(hash).one.key).toEqual("one");
  });

  it("should return a collection", () => {
    var expected = [
      {
        value: "one",
        key: "one"
      },
      {
        value: "two",
        key: "two"
      }
    ]
    expect(hashToCollection(hash)[0].key).toEqual(expected[0].key);
    expect(hashToCollection(hash)[0].key).toEqual("one");
  });

  it("shouldn't bail on a empty hash", () => {
    var supplied = {}
    var expected = []
    expect(hashToCollection(supplied)).toEqual([]);
    // expect(hashToCollection(hash)[0].key).toEqual("one");
  });

});
