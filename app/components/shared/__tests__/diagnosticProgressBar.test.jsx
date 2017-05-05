import React from 'react';
import { shallow } from 'enzyme';

import DiagnosticProgressBar from '../diagnosticProgressBar.jsx';

describe('DiagnosticProgressBar component', () => {
  const wrapper = shallow(<DiagnosticProgressBar percent={15}/> )

  it('renders a progress element', () => {
    expect(wrapper.find('progress')).toHaveLength(1)
  })

})
