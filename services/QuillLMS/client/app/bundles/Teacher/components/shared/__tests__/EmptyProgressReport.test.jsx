import { shallow } from 'enzyme';
import React from 'react';

import EmptyProgressReport from '../EmptyProgressReport.jsx';

describe('EmptyProgressReport component', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { assign: jest.fn() }
  });

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

    it('should redirect appropriately on button click', () => {
      wrapper.find('button').simulate('click');
      expect(window.location.assign).toBeCalledWith('/assign');
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

    it('should redirect appropriately on button click', () => {
      wrapper.find('button').simulate('click');
      expect(window.location.assign).toBeCalledWith('/teachers/classrooms');
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

    it('should redirect appropriately on button click', () => {
      wrapper.find('button').simulate('click');
      expect(window.location.assign).toBeCalledWith('/teachers/classrooms?modal=create-a-class');
    });
  });

  describe('when "activitiesWithinDateRange" is passed as its missing prop', () => {
    const buttonClickMock = jest.fn();
    const wrapper = shallow(
      <EmptyProgressReport
        missing="activitiesWithinDateRange"
        onButtonClick={buttonClickMock}
      />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('Reset Date Range');
    });

    it('should render paragraphs with the expected text', () => {
      const expectedText = 'Please select a date range in which you assigned activities or your students worked on them.';
      expect(wrapper.find('p').text()).toEqual(expectedText);
    });

    it('should call the passed function onclick', () => {
      wrapper.find('button').simulate('click');
      expect(buttonClickMock).toHaveBeenCalled();
    });
  });

  describe('when "activitiesForSelectedClassroom" is passed as its missing prop', () => {
    const buttonClickMock = jest.fn();
    const wrapper = shallow(
      <EmptyProgressReport
        missing="activitiesForSelectedClassroom"
        onButtonClick={buttonClickMock}
      />
    );

    it('should render a button with the expected text', () => {
      expect(wrapper.find('button').text()).toEqual('View All Classes');
    });

    it('should render paragraphs with the expected text', () => {
      const expectedText = 'Please select a class that has activities, or assign new activities from the \'Assign Activities\' page.';
      expect(wrapper.find('p').text()).toEqual(expectedText);
    });

    it('should call the passed function onclick', () => {
      wrapper.find('button').simulate('click');
      expect(buttonClickMock).toHaveBeenCalled();
    });
  });
});
