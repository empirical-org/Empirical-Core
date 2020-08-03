import React from 'react';
import { shallow } from 'enzyme';

import { CueExplanation } from 'quill-component-library/dist/componentLibrary';

describe('CueExplanation component', () => {
  const text = 'Add words'

  const wrapper = shallow(<CueExplanation text={text} />)
  it('renders a div element with the class cue-explanation', () => {
    expect(wrapper.find('div.cue-explanation')).toHaveLength(1)
  })

  it('renders the cue it is passed', () => {
    expect(wrapper.text()).toEqual(text)
  })

})
