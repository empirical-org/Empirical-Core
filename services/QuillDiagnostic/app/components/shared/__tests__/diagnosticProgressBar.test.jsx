import React from 'react';
import { shallow } from 'enzyme';

import { ProgressBar } from 'quill-component-library/dist/componentLibrary';

describe('ProgressBar component', () => {
  const wrapper = shallow(<ProgressBar percent={15} /> )

  it('renders a progress element', () => {
    expect(wrapper.find('progress')).toHaveLength(1)
  })

})
