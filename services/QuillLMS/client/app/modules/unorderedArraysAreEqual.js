const OBJECT = 'object'

export function unorderedArraysAreEqual(arr1, arr2) {
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  // Create a copy of the second array
  const arr2Copy = [...arr2];

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2Index = arr2Copy.findIndex(obj => objectsAreEqual(obj, obj1));

    if (obj2Index === -1) {
      return false;
    }

    // Remove the matched object from the copy
    arr2Copy.splice(obj2Index, 1);
  }

  return true;
}

function objectsAreEqual(obj1, obj2) {
  if (typeof obj1 !== OBJECT || typeof obj2 !== OBJECT) {
    return obj1 === obj2
  }

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (let key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
