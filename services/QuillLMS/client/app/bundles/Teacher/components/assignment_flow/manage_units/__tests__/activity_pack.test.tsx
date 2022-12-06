import * as React from 'react';
import { mount } from 'enzyme';

import data from './data'

import ActivityPack from '../activity_pack';

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2022, 10, 10));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('ActivityPack component', () => {
  it('renders if the current user created the unit', () => {
    const wrapper = mount(<ActivityPack data={data.ownerExampleData} getUnits={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders if the current user did not create the unit', () => {
    const wrapper = mount(<ActivityPack data={data.coteacherExampleData} getUnits={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
