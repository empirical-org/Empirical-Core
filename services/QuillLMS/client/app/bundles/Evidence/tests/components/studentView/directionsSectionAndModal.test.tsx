import * as React from 'react'
import { mount, } from 'enzyme'

import DirectionsSectionAndModal from '../../../components/studentView/directionsSectionAndModal'

const starterProps = {
  className: '',
  handleReadTheDirectionsButtonClick: () => {},
  passage: { highlight_prompt: ''},
  showReadTheDirectionsButton: false,
  inReflection: false,
  activeStep: 1
}

const inReflectionProps = { ...starterProps, inReflection: true }
const showReadTheDirectionsButtonProps = { ...starterProps, showReadTheDirectionsButton: true, }
const activeStepGreaterThanOneProps = { ...starterProps, activeStep: 2 }

describe('DirectionsSectionAndModal component', () => {
  describe('when the student is on the read passage step', () => {
    it('renders', () => {
      const wrapper = mount(<DirectionsSectionAndModal {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is in reflection', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSectionAndModal {...inReflectionProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student should see the modal', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSectionAndModal {...showReadTheDirectionsButtonProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is past the read passage step', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<DirectionsSectionAndModal {...activeStepGreaterThanOneProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

})
