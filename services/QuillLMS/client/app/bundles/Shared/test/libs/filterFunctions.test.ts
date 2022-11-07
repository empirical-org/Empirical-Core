import * as expect from 'expect';

import { filterNumbers } from '../../../Shared';

const mockRows = [{ original: { because_attempts: 2 } }, { original: { because_attempts: 3 } }, { original: { because_attempts: 4 } }]
const mockIdArray = ['because_attempts']

describe('#filterNumbers', () => {
  it('returns the expected value', () => {
    expect(filterNumbers(mockRows, mockIdArray, ">2")).toEqual([mockRows[1], mockRows[2]])
    expect(filterNumbers(mockRows, mockIdArray, "<3")).toEqual([mockRows[0]])
    expect(filterNumbers(mockRows, mockIdArray, "1-3")).toEqual([mockRows[0], mockRows[1]])
  });
});
