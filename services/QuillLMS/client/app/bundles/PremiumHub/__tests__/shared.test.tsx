import * as React from 'react';

import { hashPayload } from '../shared';

describe('hashPayload function', () => {

  test('it should always generate the same hash', () => {
    const payload = ['hello', 'world']

    expect(hashPayload(payload)).toEqual('2095312189753de6ad47dfe20cbe97ec')
  })

  test('it should generate the the same hash every time with a real-world payload', () => {
    const payload = [].concat(
      'active-classrooms',
      'last-30-days',
      [1,2,3],
      ['Kindergarten',1,2,3,4],
      [3,4,5],
      [6,7]
    )

    expect(hashPayload(payload)).toEqual('ddf3864a54d23d58ee4a0b619c8f3ff6')
  })
})
