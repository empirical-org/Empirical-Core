import React from 'react';
import { shallow } from 'enzyme';

import EmptyProgressReport from '../EmptyProgressReport.jsx';

describe('EmptyProgressReport component', () => {
  describe('when "activities" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="activities" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Assign an Activity');
    });

    it('should render paragraphs with the expected text', () => {
      const expectedText = 'In order to access our different reports, you need to assign activities to your students.';
      expect(wrapper.find('p').text()).toEqual(expectedText);
    });
  });

  describe('when "students" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="students" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Invite Students');
    });

    it('should render paragraphs with the expected text', () => {
      const expectedText = 'In order to access our different reports, you need to invite your students and assign activities.';
      expect(wrapper.find('p').text()).toEqual(expectedText);
    });
  });

  describe('when "classrooms" is passed as its missing prop', () => {
    const wrapper = shallow(
      <EmptyProgressReport missing="classrooms" />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Create a Class');
    });

    it('should render paragraphs with the expected text', () => {
      const expectedText = 'In order to access our different reports, you need to create a class and assign activities to your students.';
      expect(wrapper.find('p').text()).toEqual(expectedText);
    });
  });
});
