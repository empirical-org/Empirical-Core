import * as React from 'react'
import { shallow, mount, } from 'enzyme';
import toJson from 'enzyme-to-json';

import EditorContainer from '../../components/studentView/editorContainer'
import { activityOne } from './data'

describe('EditorContainer component', () => {
  describe('when the activity has loaded', () => {
    const activitiesReducer = { hasReceivedData: true, currentActivity: activityOne}
    const sessionReducer = { submittedResponses: [] }
    const wrapper = mount(<EditorContainer
      activities={activitiesReducer}
      session={sessionReducer}
      dispatch={() => {}}
    />)

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })

  })
})
