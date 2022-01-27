import * as React from 'react'
import { mount, } from 'enzyme'

import DirectionsSection from '../../../components/studentView/directionsSection'

const starterProps = {
  className: '',
  passage: { highlight_prompt: ''},
  inReflection: false,
  activeStep: 1
}

const inReflectionProps = { ...starterProps, inReflection: true }
const showReadTheDirectionsButtonProps = { ...starterProps, showReadTheDirectionsButton: true, }
const activeStepGreaterThanOneProps = { ...starterProps, activeStep: 2 }

describe('DirectionsSection component', () => {
  describe('when the student is on the read passage step', () => {
    it('renders', () => {
      const wrapper = mount(<DirectionsSection {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is in reflection', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSection {...inReflectionProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student should see the modal', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSection {...showReadTheDirectionsButtonProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is past the read passage step', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSection {...activeStepGreaterThanOneProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

})
