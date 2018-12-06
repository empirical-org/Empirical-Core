import {
  embedIdInFirebaseObject,
  convertFirebaseIndexToFirebaseCollection,
} from './firebase';

test('embeds id in a firebase object', () => {
  const firebaseObject = {
    name: "Test Object",
    flags: ['alpha']
  } as any
  const id = "abc123"
  const expected = Object.assign({}, firebaseObject, {id});
  expect(embedIdInFirebaseObject(firebaseObject, id)).toEqual(expected)
});

test('can convert a firebase index to a collection of firebase objects', () => {
  const firebaseIndex = {
    "abc": {
      name: "Object abc"
    },
    "def": {
      name: "Object def"
    }
  }
  const expected = [
    {
      id: "abc",
      name: "Object abc"
    },
    {
      id: "def",
      name: "Object def"
    }
  ]
  expect(convertFirebaseIndexToFirebaseCollection(firebaseIndex)).toEqual(expected)
})