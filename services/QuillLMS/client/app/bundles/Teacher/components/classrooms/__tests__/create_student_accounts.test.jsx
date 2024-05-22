import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { DataTable } from '../../../../Shared/index';

const classroom = { id: 1, code: 'happy-day', name: 'Classroom'}

import CreateStudentAccounts from '../create_student_accounts';

describe('CreateStudentAccounts component', () => {

  describe('on initial load', () => {

    const wrapper = shallow(
      <CreateStudentAccounts classroom={classroom} next={() => {}} />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    })

    it('should have a disabled secondary (submit) button', () => {
      expect(wrapper.find('.quill-button.secondary.submit-button').hasClass('disabled')).toBe(true)
    })

    it('should have a disabled primary (footer) button', () => {
      expect(wrapper.find('.quill-button.primary').hasClass('disabled')).toBe(true)
    })
  })

  describe('after filling out the form to add a student', () => {
    const wrapper = shallow(
      <CreateStudentAccounts classroom={classroom} next={() => {}} />
    );

    wrapper.setState({ firstName: 'Happy', lastName: "Kid" })

    it('should not have a disabled submit button', () => {
      expect(wrapper.find('.quill-button.secondary.submit-button').hasClass('disabled')).toBe(false)
    })
  })

  describe('after adding a student', () => {
    const wrapper = mount(<CreateStudentAccounts classroom={classroom} next={() => {}} />, { attachTo: document.body });

    wrapper.setState({ firstName: 'Hello', lastName: 'Kid', students: [{ name: 'Happy Kid', password: 'Kid', username: 'happy.kid@happy-day'}] })
    wrapper.instance().addStudent({ preventDefault() {} })

    it('should not have a disabled footer button', () => {
      expect(wrapper.find('.quill-button.primary').hasClass('disabled')).toBe(false)
    })

    it('should render a datatable', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })

    it('should focus on the first name input box', () => {
      const focusedElement = document.activeElement;
      const inputNode = wrapper.find('input#first-name').getDOMNode();
      expect(focusedElement).toBe(inputNode);
      expect(wrapper.find('.input-container.last-name').hasClass('active')).toBe(false)
    })

  })

})
