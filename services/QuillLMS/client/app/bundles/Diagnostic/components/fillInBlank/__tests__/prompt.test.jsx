import { shallow } from 'enzyme';
import React from 'react';

import { Prompt } from '../../../../Shared/index';

describe('Prompt component', () => {

  const wrapper = shallow(<Prompt />)
  it('renders a div element', () => {
    expect(wrapper.find('div')).toHaveLength(1)
  })

})
