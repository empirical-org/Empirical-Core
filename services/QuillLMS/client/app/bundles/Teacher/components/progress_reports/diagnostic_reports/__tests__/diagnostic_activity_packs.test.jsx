import React from 'react'
import { mount } from 'enzyme'
import * as $ from 'jquery'

import { diagnostics} from './test_data'

import DiagnosticActivityPacks from '../diagnostic_activity_packs'
import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'

describe('DiagnosticActivityPacks component', () => {
  it('should render when it is loading', () => {
    const wrapper = mount(<DiagnosticActivityPacks />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are no diagnostic activities', () => {
    const wrapper = mount(<DiagnosticActivityPacks passedDiagnostics={[]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are diagnostic activities', () => {
    const wrapper = mount(<DiagnosticActivityPacks passedDiagnostics={diagnostics} />)
    expect(wrapper).toMatchSnapshot()
  })
})
