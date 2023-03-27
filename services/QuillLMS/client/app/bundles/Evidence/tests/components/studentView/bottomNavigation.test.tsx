import { mount } from 'enzyme'
import * as React from 'react'

import BottomNavigation from '../../../components/studentView/bottomNavigation'

const starterProps = {
  scrolledToEndOfPassage: () => {},
  studentHighlights: [],
  onMobile: false,
  handleClickDoneHighlighting: () => {},
  doneHighlighting: false,
  handleDoneReadingClick: () => {},
  hasStartedPromptSteps: false,
  hasStartedReadPassageStep: false,
  handleStartPromptStepsClick: () => {},
  handleStartReadingPassageClick: () => {},
  inReflection: false
}

const hasStartedReadingPassageProps = {...starterProps, hasStartedReadPassageStep: true}

const hasScrolledToEndOfPassageProps = {...hasStartedReadingPassageProps, scrolledToEndOfPassage: true}

const hasStartedHighlightingProps = {...hasScrolledToEndOfPassageProps, studentHighlights: ['blah blah']}

const hasMadeAtLeastTwoHighlightsProps = {...hasStartedHighlightingProps, studentHighlights: ['blah blah', 'blue blue']}

const inReflectionProps = {...hasMadeAtLeastTwoHighlightsProps, inReflection: true, doneHighlighting: true, }

const doneReflectionProps = {...inReflectionProps, inReflection: false}

describe('BottomNavigation component', () => {
  describe('when the student has not started the read passage step yet', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...starterProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...starterProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student has started the read passage step but not yet scrolled to the end of the passage', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...hasStartedReadingPassageProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...hasStartedReadingPassageProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student has scrolled to the end of the passage but not yet started highlighting', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...hasScrolledToEndOfPassageProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...hasScrolledToEndOfPassageProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student has started highlighting', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...hasStartedHighlightingProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...hasStartedHighlightingProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student has made at least two highlights', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...hasMadeAtLeastTwoHighlightsProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...hasMadeAtLeastTwoHighlightsProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is in reflection', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...inReflectionProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...inReflectionProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the student is done reflecting', () => {
    it('renders on desktop', () => {
      const wrapper = mount(<BottomNavigation {...doneReflectionProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('renders on mobile', () => {
      const wrapper = mount(<BottomNavigation {...doneReflectionProps} onMobile={true} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
