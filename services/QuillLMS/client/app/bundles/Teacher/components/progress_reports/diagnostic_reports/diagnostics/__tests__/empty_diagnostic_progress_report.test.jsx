import { mount } from 'enzyme';
import React from 'react';

import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report.jsx';

describe('EmptyDiagnosticProgressReport component', () => {

  it('should render a header', () => {
    const wrapper = mount(
      <EmptyDiagnosticProgressReport />
    );
    expect(wrapper).toMatchSnapshot()
  })

})
