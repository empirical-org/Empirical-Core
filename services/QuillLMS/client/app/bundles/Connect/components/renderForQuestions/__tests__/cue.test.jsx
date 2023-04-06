import { shallow } from 'enzyme';
import React from 'react';

import { Cue } from '../../../../Shared/index';

describe('Cue component', () => {
  const cue = 'or'

  const wrapper = shallow(<Cue cue={cue} />)
  it('renders a div element with the class cue', () => {
    expect(wrapper.find('div.cue')).toHaveLength(1)
  })

  it('renders the cue it is passed', () => {
    expect(wrapper.text()).toEqual(cue)
  })

})
