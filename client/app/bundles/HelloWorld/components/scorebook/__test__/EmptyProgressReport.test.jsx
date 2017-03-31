import React from 'react';
import { shallow } from 'enzyme';

import EmptyProgressReport from '../EmptyProgressReport.jsx'

describe('EmptyProgressReport component', () => {

  describe('when "activities" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="activities" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Assign an Activity')
    })

    it('should render paragraphs with the expected text', () => {
      const expectedText = "Welcome! This is where your student reports will be stored, but you haven't assigned any activities yet.Let's add your first activity."
      expect(wrapper.find('.col-xs-7').text()).toEqual(expectedText)
    })

  })

  describe('when "activities" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="students" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Invite Students')
    })

    it('should render paragraphs with the expected text', () => {
      const expectedText = "Welcome! This is where your student reports will be stored, but you haven't invited any students yet.Let's invite some students."
      expect(wrapper.find('.col-xs-7').text()).toEqual(expectedText)
    })

  })

  describe('when "activities" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="classrooms" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Create a Class')
    })

    it('should render paragraphs with the expected text', () => {
      const expectedText = "Welcome! This is where your student reports will be stored, but you don't have any classrooms yet.Let's add your first class."
      expect(wrapper.find('.col-xs-7').text()).toEqual(expectedText)
    })

  })
})
