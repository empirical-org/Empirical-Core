import * as React from 'react'
import { shallow } from 'enzyme';

import { StudentViewContainer } from '../../components/studentView/container'
import LoadingSpinner from '../../components/shared/loadingSpinner'
import PromptStep from '../../components/studentView/promptStep'
import { activityOne } from './data'

describe('StudentViewContainer component', () => {
  describe('when the activity has loaded', () => {
    const activitiesReducer = { hasReceivedData: true, currentActivity: activityOne}
    const wrapper = shallow(<StudentViewContainer
      dispatch={() => {}}
      activities={activitiesReducer}
    />)

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a promptStep for each prompt in the activity', () => {
      expect(wrapper.find(PromptStep).length).toBe(activityOne.prompts.length)
    })
  })

  describe('when the activity has not loaded', () => {
    const activitiesReducer = { hasReceivedData: false }
    const wrapper = shallow(<StudentViewContainer
      dispatch={() => {}}
      activities={activitiesReducer}
    />)

    it('renders a loading spinner', () => {
      expect(wrapper.find(LoadingSpinner).length).toBe(1)
    })
  })

})
