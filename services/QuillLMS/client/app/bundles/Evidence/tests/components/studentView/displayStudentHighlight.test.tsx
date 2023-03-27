import { mount } from 'enzyme'
import * as React from 'react'

import DisplayStudentHighlight from '../../../components/studentView/displayStudentHighlight'

const starterProps = {
  studentHighlight: 'This is a sentence I chose to highlight.',
  removeHighlight: () => {},
  inReflection: false
}

const inReflectionProps = { ...starterProps, inReflection: true }

describe('DisplayStudentHighlight component', () => {
  describe('when the student is on the read passage step', () => {
    it('renders', () => {
      const wrapper = mount(<DisplayStudentHighlight {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is in reflection', () => {
    it('renders', () => {
      const wrapper = mount(<DisplayStudentHighlight {...inReflectionProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

})
