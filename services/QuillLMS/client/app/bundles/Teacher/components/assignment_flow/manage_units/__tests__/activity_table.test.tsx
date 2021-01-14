import * as React from 'react';
import 'react-dates/initialize';
import { mount } from 'enzyme';

import data from './data'

import ActivityTable from '../activity_table';

describe('ActivityTable component', () => {
  it('renders if the current user created the unit', () => {
    const wrapper = mount(<ActivityTable data={data.ownerExampleData} isOwner={true} onSuccess={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders if the current user did not create the unit', () => {
    const wrapper = mount(<ActivityTable data={data.coteacherExampleData} isOwner={false} onSuccess={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
