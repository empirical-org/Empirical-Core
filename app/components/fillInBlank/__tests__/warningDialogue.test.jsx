import React from 'react';
import { shallow } from 'enzyme';

import WarningDialogue from '../warningDialogue.jsx';

describe('WarningDialogue component', () => {
  const text = 'Use one of the words below.'

  const wrapper = shallow(<WarningDialogue text={text} />)
  it('renders a div element with the class warning-dialogue', () => {
    expect(wrapper.find('div.warning-dialogue')).toHaveLength(1)
  })

  it('renders the warning it is passed', () => {
    expect(wrapper.text()).toEqual(text)
  })

})
