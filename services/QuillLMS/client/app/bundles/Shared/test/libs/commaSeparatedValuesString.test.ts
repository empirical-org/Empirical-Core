import * as expect from 'expect';

import { commaSeparatedValuesString } from '../../../Shared';

describe('#commaSeparatedValuesString', () => {
  it('returns the expected string output', () => {
    const firstArray = ['red', 'blue', 'green'];
    const secondArray = ['two words', 'and three words'];
    expect(commaSeparatedValuesString(firstArray)).toEqual('red, blue, green');
    expect(commaSeparatedValuesString(secondArray)).toEqual('two words, and three words');
  });
});
