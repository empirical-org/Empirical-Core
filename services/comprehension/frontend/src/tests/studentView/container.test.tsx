import * as React from 'react'
import { shallow, mount, } from 'enzyme';
import toJson from 'enzyme-to-json';

import queryStringMock from '../../../__mocks__/query-string';
jest.mock('query-string')

import { StudentViewContainer } from '../../components/studentView/container'
import LoadingSpinner from '../../components/shared/loadingSpinner'
import PromptStep from '../../components/studentView/promptStep'
import { activityOne } from './data'

describe('StudentViewContainer component', () => {
  describe('when the activity has loaded', () => {
    const activitiesReducer = { hasReceivedData: true, currentActivity: activityOne}
    const sessionReducer = { submittedResponses: [] }
    const wrapper = mount(<StudentViewContainer
      activities={activitiesReducer}
      dispatch={() => {}}
      session={sessionReducer}
      location={{ search: "?uid=1" }}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should render a promptStep for each prompt in the activity', () => {
      expect(wrapper.find(PromptStep).length).toBe(activityOne.prompts.length)
    })

    describe('when the user clicks the done reading button', () => {
      it('should increase to the next step', () => {
        wrapper.find('.done-reading-button').simulate('click')
        expect(wrapper.state('activeStep')).toBe(2)
        expect(wrapper.state('completedSteps')).toEqual([1])
      })
    })

    describe('when complete step is called', () => {
      describe('when the next step has not yet been completed and is not more than the total number of steps', () => {
        it('sets the next chronological step as the active step', () => {
          wrapper.setState({ completedSteps: [1] })
          wrapper.instance().completeStep(2)
          expect(wrapper.state('activeStep')).toBe(3)
          expect(wrapper.state('completedSteps')).toEqual([1, 2])
        })
      })

      describe('when the next step has already been completed', () => {
        it('sets the first uncompleted step as the active step', () => {
          wrapper.setState({ completedSteps: [1, 3] })
          wrapper.instance().completeStep(4)
          expect(wrapper.state('activeStep')).toBe(2)
          expect(wrapper.state('completedSteps')).toEqual([1, 3, 4])
        })
      })

      describe('when the next step is more than the total number of steps', () => {
        it('sets the first uncompleted step to be the active step', () => {
          wrapper.setState({ completedSteps: [1, 2, 3] })
          wrapper.instance().completeStep(4)
          expect(wrapper.state('activeStep')).toBe(undefined)
          expect(wrapper.state('completedSteps')).toEqual([1, 2, 3, 4])
        })
      })
    })

    describe('when the user clicks on a stepLink', () => {
      const scrollToStepMock = jest.fn()
      wrapper.instance().scrollToStep = scrollToStepMock

      describe('when the read passage step has been completed', () => {

        it('activates that step', () => {
          wrapper.setState({ completedSteps: [1], activeStep: 1 })
          wrapper.find('.step-links').find('.step-link').last().simulate('click')
          expect(wrapper.state('activeStep')).toBe(4)
          expect(scrollToStepMock).toHaveBeenCalled()
        })
      })

      describe('when the read passage step has not been completed', () => {

        it('does not change the step', () => {
          wrapper.setState({ completedSteps: [], activeStep: 1 })
          wrapper.find('.step-links').find('.step-link').last().simulate('click')
          expect(wrapper.state('activeStep')).toBe(1)
          expect(scrollToStepMock).toHaveBeenCalled()
        })
      })
    })

  })

  describe('when the activity has not loaded', () => {
    const activitiesReducer = { hasReceivedData: false }
    const sessionReducer = { submittedResponses: {} }
    const wrapper = shallow(<StudentViewContainer
      activities={activitiesReducer}
      dispatch={() => {}}
      session={sessionReducer}
      location={{ search: "?uid=1" }}
    />)

    it('renders a loading spinner', () => {
      expect(wrapper.find(LoadingSpinner).length).toBe(1)
    })
  })

})
