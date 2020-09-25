import React from 'react';
import { shallow } from 'enzyme';
import { Prompt } from 'quill-component-library/dist/componentLibrary';

describe('Prompt component', () => {

  const wrapper = shallow(<Prompt />)
  it('renders a div element', () => {
    expect(wrapper.find('div')).toHaveLength(1)
  })

})
