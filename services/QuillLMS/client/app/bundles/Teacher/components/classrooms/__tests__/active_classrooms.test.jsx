import React from 'react';
import { shallow } from 'enzyme';

import ActiveClassrooms, {
  createAClassModal,
  renameClassModal,
  changeGradeModal,
  archiveClassModal,
  inviteStudentsModal,
  importGoogleClassroomsModal,
  importGoogleClassroomStudentsModal,
  googleClassroomEmailModal,
  googleClassroomsEmptyModal
} from '../active_classrooms.tsx';
import Classroom from '../classroom.tsx'
import CreateAClassModal from '../create_a_class_modal'
import RenameClassModal from '../rename_classroom_modal'
import ChangeGradeModal from '../change_grade_modal'
import ArchiveClassModal from '../archive_classroom_modal'
import InviteStudentsModal from '../invite_students_modal'
import ImportGoogleClassroomsModal from '../import_google_classrooms_modal'
import ImportGoogleClassroomStudentsModal from '../import_google_classroom_students_modal'
import GoogleClassroomEmailModal from '../google_classroom_email_modal'
import GoogleClassroomsEmptyModal from '../google_classrooms_empty_modal'

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

    it('should render the create a class modal if showModal equals createAClassModal', () => {
      wrapper.instance().setState({ showModal: createAClassModal, })
      expect(wrapper.find(CreateAClassModal).exists()).toBe(true)
    })

    it('should render the rename class modal if showModal equals renameClassModal', () => {
      wrapper.instance().setState({ showModal: renameClassModal, })
      expect(wrapper.find(RenameClassModal).exists()).toBe(true)
    })

    it('should render the change grade modal if showModal equals changeGradeModal', () => {
      wrapper.instance().setState({ showModal: changeGradeModal, })
      expect(wrapper.find(ChangeGradeModal).exists()).toBe(true)
    })

    it('should render the archive class modal if showModal equals archiveClassModal', () => {
      wrapper.instance().setState({ showModal: archiveClassModal, })
      expect(wrapper.find(ArchiveClassModal).exists()).toBe(true)
    })

    it('should render the import google classrooms modal if showModal equals importGoogleClassroomsModal', () => {
      wrapper.instance().setState({ showModal: importGoogleClassroomsModal, })
      expect(wrapper.find(ImportGoogleClassroomsModal).exists()).toBe(true)
    })

    it('should render the import google classroom students modal if showModal equals ImportGoogleClassroomStudentsModal', () => {
      wrapper.instance().setState({ showModal: importGoogleClassroomStudentsModal, })
      expect(wrapper.find(ImportGoogleClassroomStudentsModal).exists()).toBe(true)
    })

    it('should render the empty google classrooms modal if showModal equals googleClassroomsEmptyModal', () => {
      wrapper.instance().setState({ showModal: googleClassroomsEmptyModal, })
      expect(wrapper.find(GoogleClassroomsEmptyModal).exists()).toBe(true)
    })

    it('should render the google classrooms email modal if showModal equals googleClassroomEmailModal', () => {
      wrapper.instance().setState({ showModal: googleClassroomEmailModal, })
      expect(wrapper.find(GoogleClassroomEmailModal).exists()).toBe(true)
    })

    it('should render the invite students modal if showModal equals inviteStudentsModal', () => {
      wrapper.instance().setState({ showModal: inviteStudentsModal, })
      expect(wrapper.find(InviteStudentsModal).exists()).toBe(true)
    })

  })

});
