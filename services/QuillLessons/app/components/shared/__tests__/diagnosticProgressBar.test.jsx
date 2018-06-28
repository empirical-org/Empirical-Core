import React from 'react';
import { shallow } from 'enzyme';

import { DiagnosticProgressBar } from 'quill-component-library/dist/componentLibrary';

describe('DiagnosticProgressBar component', () => {
  const wrapper = shallow(<DiagnosticProgressBar percent={15}/> )

  it('renders a progress element', () => {
    expect(wrapper.find('progress')).toHaveLength(1)
  })

})
