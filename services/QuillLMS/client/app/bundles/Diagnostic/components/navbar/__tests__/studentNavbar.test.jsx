import { mount } from 'enzyme';
import React from 'react';
import { StudentNavbar } from '../studentNavbar';

describe('StudentNavbar', () => {
  it('renders when the language menu is open', () => {
    const wrapper = mount(<StudentNavbar
      playDiagnostic={{
        languageMenuOpen: true
      }}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders when the language menu is not open', () => {
    const wrapper = mount(<StudentNavbar playDiagnostic={{}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
