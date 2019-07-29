import React from 'react';
import { shallow } from 'enzyme';

import ActiveClassrooms from '../active_classrooms.tsx';
import Classroom from '../classroom.tsx'
import CreateAClassModal from '../create_a_class_modal'
import RenameClassModal from '../rename_classroom_modal'
import ChangeGradeModal from '../change_grade_modal'
import ArchiveClassModal from '../archive_classroom_modal'
import InviteStudentsModal from '../invite_students_modal'

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

    // showCreateAClassModal: boolean;
    // showRenameClassModal: boolean;
    // showChangeGradeModal: boolean;
    // showArchiveClassModal: boolean;
    // showInviteStudentsModal: boolean;


    it('should render the create a class modal if showCreateAClassModal is true', () => {
      wrapper.instance().setState({ showCreateAClassModal: true, })
      expect(wrapper.find(CreateAClassModal).exists()).toBe(true)
    })

    it('should render the create a class modal if showRenameClassModal is true', () => {
      wrapper.instance().setState({ showRenameClassModal: true, })
      expect(wrapper.find(RenameClassModal).exists()).toBe(true)
    })

    it('should render the create a class modal if showChangeGradeModal is true', () => {
      wrapper.instance().setState({ showChangeGradeModal: true, })
      expect(wrapper.find(ChangeGradeModal).exists()).toBe(true)
    })

    it('should render the create a class modal if showArchiveClassModal is true', () => {
      wrapper.instance().setState({ showArchiveClassModal: true, })
      expect(wrapper.find(ArchiveClassModal).exists()).toBe(true)
    })

    it('should render the create a class modal if showInviteStudentsModal is true', () => {
      wrapper.instance().setState({ showInviteStudentsModal: true, })
      expect(wrapper.find(InviteStudentsModal).exists()).toBe(true)
    })

  })

});
