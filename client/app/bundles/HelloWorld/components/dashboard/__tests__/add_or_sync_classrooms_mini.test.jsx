import React from 'react'
import { mount, shallow } from 'enzyme'
import AddOrSyncClassroomsMini from '../add_or_sync_classrooms_mini.jsx'

const googleUser= {signed_up_with_google: true}
const nonGoogleUser= {signed_up_with_google: false}

describe('the AddOrSyncClassroomsMini component', () => {

  it('should default to not showing the modal', () => {
      const wrapper = shallow(
        <AddOrSyncClassroomsMini user={nonGoogleUser} />
      )
      expect(wrapper.state('showModal')).toBe(false)
  })

  it('clicking the sync button should set showModal to be true if the teacher is not a google user', () => {
      const wrapper = shallow(
        <AddOrSyncClassroomsMini user={nonGoogleUser} />
      )
      wrapper.find('.dashed').first().simulate('click')
      expect(wrapper.state('showModal')).toBe(true)
  })

  it('clicking the sync button should not set showModal to be true if the teacher is not a google user', () => {
      const wrapper = shallow(
        <AddOrSyncClassroomsMini user={googleUser} />
      )
      wrapper.find('.dashed').first().simulate('click')
      expect(wrapper.state('showModal')).toBe(false)
  })


})
