import * as React from 'react';

import { hashPayload } from '../shared';

describe('hashPayload function', () => {
  const payload = ['hello', 'world']

  test('it should always generate the same hash', () => {
    expect(hashPayload(payload)).toEqual('2095312189753de6ad47dfe20cbe97ec')
  })
})
