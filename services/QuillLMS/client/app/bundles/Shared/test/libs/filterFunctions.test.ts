import * as expect from 'expect';

import { filterNumbers } from '../../../Shared';
import { filterObjectArrayByAttributes } from '../../libs/filterFunctions';

const mockRows = [{ original: { because_attempts: 2 } }, { original: { because_attempts: 3 } }, { original: { because_attempts: 4 } }]
const mockIdArray = ['because_attempts']

describe('#filterNumbers', () => {
  it('returns the expected value', () => {
    expect(filterNumbers(mockRows, mockIdArray, ">2")).toEqual([mockRows[1], mockRows[2]])
    expect(filterNumbers(mockRows, mockIdArray, "<3")).toEqual([mockRows[0]])
    expect(filterNumbers(mockRows, mockIdArray, "1-3")).toEqual([mockRows[0], mockRows[1]])
  });
});

describe('#filterObjectArrayByAttributes', () => {
  it('returns the expected value', () => {
    const objectArray = [
      { foo: 1, bar: 2 },
      { foo: 3, bar: 4 }
    ]
    const allowedAttributes = ['bar', 'baz']
    const expectedResult = [
      { bar: 2, baz: null },
      { bar: 4, baz: null }
    ]
    expect(filterObjectArrayByAttributes(objectArray, allowedAttributes)).toEqual(expectedResult)

  });
});
