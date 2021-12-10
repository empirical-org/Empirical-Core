import React from 'react'
import { mount } from 'enzyme'
import * as $ from 'jquery'

import { classrooms, } from './test_data'

import DiagnosticActivityPacks from '../diagnostic_activity_packs'
import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report'
import LoadingSpinner from '../../../../shared/loading_indicator.jsx'

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
