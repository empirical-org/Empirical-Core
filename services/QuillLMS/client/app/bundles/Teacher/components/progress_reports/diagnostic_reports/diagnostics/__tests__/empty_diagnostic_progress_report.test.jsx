import React from 'react';
import { mount } from 'enzyme';

import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report.jsx'

describe('EmptyDiagnosticProgressReport component', () => {

  it('should render a header', () => {
    const wrapper = mount(
      <EmptyDiagnosticProgressReport />
    );
    expect(wrapper).toMatchSnapshot()
  })

})
