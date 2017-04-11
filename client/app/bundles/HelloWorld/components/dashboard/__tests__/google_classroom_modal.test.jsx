import React from 'react'
import { shallow } from 'enzyme'
import GoogleClassroomModal from '../google_classroom_modal.jsx'

const user={email: 'hal@spaceodyssey.org'}

describe('the GoogleClassroomModal component', () => {

  it('should render', () => {
      const wrapper = shallow(
        <GoogleClassroomModal user={user} />
      )
      expect(wrapper).toMatchSnapshot()
  })

  it('should render the email in the state in the input field', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    expect(wrapper.find('input').first().props().value).toBe(user.email)
  })

  it('should update the state based on the text in the input field', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    wrapper.find('input').first().simulate('change', {target: {value: 'badhal@space'}});
    expect(wrapper.state('email')).toBe('badhal@space')
  })

  it('should render "Update Email" for the submit button when the email has not been updated', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    expect(wrapper.find('input').last().props().value).toBe('Update Email')
  })

  it('should render "Updated!" for the submit button when the email has not been updated', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    wrapper.setState({updated: true, email: 'dave@spaceodyssey.org'})
    expect(wrapper.find('input').last().props().value).toBe('Updated!')
  })

  it('should render a div with no text when there are no errors', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    expect(wrapper.find('.error').text()).toBe('')
  })

  it('should render a div with the text of the error when there is an error', () => {
    const wrapper = shallow(
      <GoogleClassroomModal user={user} />
    )
    wrapper.setState({error: 'I am an error'})
    expect(wrapper.find('.error').text()).toBe('I am an error')
  })

})
