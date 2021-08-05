import * as React from 'react'
import { mount, } from 'enzyme'

import StepOverview from '../../../components/studentView/stepOverview'

const starterProps = {
  activeStep: 1,
  handleClick: () => {}
}

const pastStepOneProps = { ...starterProps, activeStep: 2 }

describe('StepOverview component', () => {
  describe('when the student is on step one', () => {
    it('renders', () => {
      const wrapper = mount(<StepOverview {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is past step one', () => {
    it('renders', () => {
      const wrapper = mount(<StepOverview {...pastStepOneProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

})
