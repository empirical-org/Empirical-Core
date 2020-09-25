import React from 'react'
import { mount, shallow } from 'enzyme'

import AddOrSyncClassroomsMini from '../add_or_sync_classrooms_mini.jsx'

const googleUser= {signed_up_with_google: true}
const nonGoogleUser= {signed_up_with_google: false}

describe('the AddOrSyncClassroomsMini component', () => {

  it('should render', () => {
      const wrapper = shallow(
        <AddOrSyncClassroomsMini user={nonGoogleUser} />
      )
      expect(wrapper).toMatchSnapshot();
  })



})
