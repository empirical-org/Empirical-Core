import { shallow } from 'enzyme';
import React from 'react';

import ArchivedClassrooms, {
    unarchiveClassroomModal
} from '../archived_classrooms.tsx';
import Classroom from '../classroom.tsx';
import UnarchiveClassroomModal from '../unarchive_classroom_modal';

import { classroomProps, userProps } from './test_data/test_data';

describe('ArchivedClassrooms component', () => {

  describe('with no classrooms', () => {

    const wrapper = shallow(
      <ArchivedClassrooms classrooms={[]} user={userProps} />
    );

    it('should render with no classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });
  })

  describe('with classrooms', () => {
    const archivedClassroomProps = classroomProps.map((c) => {
      const classroom = c
      classroom.visible = false
      return classroom
    })

    const wrapper = shallow(
      <ArchivedClassrooms classrooms={archivedClassroomProps} user={userProps} />
    );

    it('should render with classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a classroom component for each classroom', () => {
      expect(wrapper.find(Classroom).length).toBe(classroomProps.length);
    })

    it('should render the invite students modal if showModal equals unarchiveClassroomModal', () => {
      wrapper.instance().openModal(unarchiveClassroomModal)
      expect(wrapper.find(UnarchiveClassroomModal).exists()).toBe(true)
    })

  })

});
