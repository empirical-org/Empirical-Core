import React from 'react';
import { shallow } from 'enzyme';

import ActiveClassrooms from '../active_classrooms.tsx';
import Classroom from '../classroom.tsx'
import { classroomProps, userProps } from './test_data/test_data'

describe('ActiveClassrooms component', () => {

  describe('with no classrooms', () => {

    const wrapper = shallow(
      <ActiveClassrooms classrooms={[]} user={userProps}/>
    );

    it('should render with no classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a no active classes div', () => {
      expect(wrapper.find('.no-active-classes').exists()).toBe(true);
    })
  })

  describe('with classrooms', () => {
    const wrapper = shallow(
      <ActiveClassrooms classrooms={classroomProps} user={userProps}/>
    );

    it('should render with classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a classroom component for each classroom', () => {
      expect(wrapper.find(Classroom).length).toBe(classroomProps.length);
    })

  })

});
