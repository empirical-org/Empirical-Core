import * as expect from 'expect';

import { getLatestAttempt } from '../../libs/getLatestAttempt';

describe('#getLatestAttempt', () => {

  const attempts = [{test: 1}, {test: 2}, {test: 3}];

  it('returns the latest attempt object ', () => {
    expect(getLatestAttempt(attempts)).toEqual({test: 3})
  });
});
