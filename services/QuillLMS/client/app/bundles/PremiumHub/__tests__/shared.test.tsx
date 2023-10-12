import * as React from 'react';

import { hashPayload } from '../shared';

describe('hashPayload function', () => {
  const payload = ['hello', 'world']

  test('it should always generate the same hash', () => {
    expect(hashPayload(payload)).toEqual('afa27b44d43b02a9fea41d13cedc2e4016cfcf87c5dbf990e593669aa8ce286d')
  })
})
