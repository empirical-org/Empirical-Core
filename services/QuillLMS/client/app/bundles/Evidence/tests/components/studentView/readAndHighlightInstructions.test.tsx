import * as React from 'react'
import { mount, } from 'enzyme'

import ReadAndHighlightInstructions from '../../../components/studentView/readAndHighlightInstructions'

const starterProps = {
  passage: { highlight_prompt: ''},
  activeStep: 1,
  showReadTheDirectionsButton: false,
  handleReadTheDirectionsButtonClick: () => {},
  studentHighlights: [],
  removeHighlight: () => {},
  inReflection: false
}

const hasStartedHighlightingProps = { ...starterProps, studentHighlights: ['This is a highlight made by a student.'] }

describe('ReadAndHighlightInstructions component', () => {
  describe('when the student has not started making highlights', () => {
    it('renders', () => {
      const wrapper = mount(<ReadAndHighlightInstructions {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student has started making highlights', () => {
    it('renders', () => {
      const wrapper = mount(<ReadAndHighlightInstructions {...hasStartedHighlightingProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

})
