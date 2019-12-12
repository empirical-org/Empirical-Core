import * as React from 'react'
import { shallow, mount, } from 'enzyme';

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
      session={sessionReducer}
      dispatch={() => {}}
    />)

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a promptStep for each prompt in the activity', () => {
      expect(wrapper.find(PromptStep).length).toBe(activityOne.prompts.length)
    })

    it('should increase to the next step when the user clicks the "Done reading" button', () => {
      wrapper.find('.done-reading-button').simulate('click')
      expect(wrapper.state('activeStep')).toBe(2)
      expect(wrapper.state('completedSteps')).toEqual([1])
    })
  })

  describe('when the activity has not loaded', () => {
    const activitiesReducer = { hasReceivedData: false }
    const sessionReducer = { submittedResponses: {} }
    const wrapper = shallow(<StudentViewContainer
      activities={activitiesReducer}
      session={sessionReducer}
      dispatch={() => {}}
    />)

    it('renders a loading spinner', () => {
      expect(wrapper.find(LoadingSpinner).length).toBe(1)
    })
  })

})
