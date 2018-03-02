import React from 'react'
import { shallow } from 'enzyme'

import UnitTemplateProfileAssignButton from '../unit_template_profile_assign_button'
import ButtonLoadingIndicator from '../../../../shared/button_loading_indicator'

describe('UnitTemplateProfileAssignButton component', () => {
  describe('when there is no authenticated user', () => {
    const wrapper = shallow(<UnitTemplateProfileAssignButton
      data={{non_authenticated: true}}
    />)
    it('renders one button', () => {
      expect(wrapper.find('button')).toHaveLength(1)
    })
    it('renders the text "Sign Up to Assign This Activity Pack"', () => {
      expect(wrapper.find('button').text()).toEqual("Sign Up to Assign This Activity Pack")
    })
  })

  describe('when there is an authenticated user', () => {
    const wrapper = shallow(<UnitTemplateProfileAssignButton
      data={{non_authenticated: false}}
      id={1}
    />)

    it('renders two buttons', () => {
      expect(wrapper.find('button')).toHaveLength(2)
    })

    describe('the first button', () => {
      const firstButton = wrapper.find('button').first()

      it('has the text "Assign to All Students"', () => {
        expect(firstButton.text()).toEqual("Assign to All Students")
      })

      it('does not render a ButtonLoadingIndicator if fastAssign is not disabled', () => {
        wrapper.setState({fastAssignDisabled: false})
        expect(wrapper.find(ButtonLoadingIndicator)).toHaveLength(0)
      })

      it('renders a ButtonLoadingIndicator if fastAssign is disabled', () => {
        wrapper.setState({fastAssignDisabled: true})
        expect(wrapper.find(ButtonLoadingIndicator)).toHaveLength(1)
      })
    })
  })
})
