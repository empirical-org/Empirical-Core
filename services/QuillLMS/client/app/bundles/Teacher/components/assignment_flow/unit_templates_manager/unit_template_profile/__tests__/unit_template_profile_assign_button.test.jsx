import React from 'react'
import { shallow } from 'enzyme'

import UnitTemplateProfileAssignButton from '../unit_template_profile_assign_button'
import ButtonLoadingIndicator from '../../../../shared/button_loading_indicator'

describe('UnitTemplateProfileAssignButton component', () => {
  describe('when there is no authenticated user', () => {
    const wrapper = shallow(<UnitTemplateProfileAssignButton
      data={{non_authenticated: true}}
    />)
    it('renders two buttons', () => {
      expect(wrapper.find('button')).toHaveLength(2)
    })
    it('renders one that says sign up and one that says log in"', () => {
      expect(wrapper.find('.quill-button.primary').text()).toEqual("Sign up")
      expect(wrapper.find('.quill-button.secondary').text()).toEqual("Log in")
    })
  })

  describe('when there is an authenticated user', () => {
    const wrapper = shallow(<UnitTemplateProfileAssignButton
      data={{non_authenticated: false}}
      id={1}
    />)

    it('renders no buttons', () => {
      expect(wrapper.find('button')).toHaveLength(0)
    })
  })
})
