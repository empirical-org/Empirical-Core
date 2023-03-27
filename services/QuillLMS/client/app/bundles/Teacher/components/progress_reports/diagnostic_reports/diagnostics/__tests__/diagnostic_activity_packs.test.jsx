import { mount } from 'enzyme'
import React from 'react'

import { classrooms } from './test_data'

import DiagnosticActivityPacks from '../diagnostic_activity_packs'

describe('DiagnosticActivityPacks component', () => {
  it('should render when there are no classrooms', () => {
    const wrapper = mount(<DiagnosticActivityPacks classrooms={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are classrooms', () => {
    const wrapper = mount(<DiagnosticActivityPacks classrooms={classrooms} />)
    expect(wrapper).toMatchSnapshot()
  })
})
