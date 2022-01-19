import React from 'react';
import { shallow } from 'enzyme';

import { classroomProps, userProps, coteacherInvitations } from './test_data/test_data'

import ActiveClassrooms, {
  createAClassModal,
  renameClassModal,
  changeGradeModal,
  archiveClassModal,
  inviteStudentsModal,
  importGoogleClassroomsModal,
  importCleverClassroomsModal,
  importCleverClassroomStudentsModal,
  importGoogleClassroomStudentsModal,
  reauthorizeCleverModal,
  linkGoogleAccountModal,
  cleverClassroomsEmptyModal,
  googleClassroomsEmptyModal
} from '../active_classrooms.tsx';
import CreateAClassModal from '../create_a_class_modal'
import RenameClassModal from '../rename_classroom_modal'
import ChangeGradeModal from '../change_grade_modal'
import ArchiveClassModal from '../archive_classroom_modal'
import InviteStudentsModal from '../invite_students_modal'
import ImportCleverClassroomsModal from '../import_clever_classrooms_modal'
import ImportGoogleClassroomsModal from '../import_google_classrooms_modal'
import ImportCleverClassroomStudentsModal from '../import_clever_classroom_students_modal'
import ImportGoogleClassroomStudentsModal from '../import_google_classroom_students_modal'
import ReauthorizeCleverModal from '../reauthorize_clever_modal'
import LinkGoogleAccountModal from '../link_google_account_modal'
import CleverClassroomsEmptyModal from '../clever_classrooms_empty_modal'
import GoogleClassroomsEmptyModal from '../google_classrooms_empty_modal'
import CoteacherInvitation from '../coteacher_invitation'
import { SortableList } from '../../../../Shared/index'

jest.spyOn(global.Date, 'now').mockImplementation(() =>
  new Date('2019-08-14T11:01:58.135Z').valueOf()
);

jest.mock('string-hash', () => ({
  default: jest.fn()
}));

describe('ActiveClassrooms component', () => {

  describe('with no classrooms or coteacher invitations ', () => {

    const wrapper = shallow(
      <ActiveClassrooms classrooms={[]} coteacherInvitations={[]} user={userProps} />
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
      <ActiveClassrooms classrooms={classroomProps} coteacherInvitations={coteacherInvitations} user={userProps} />
    );

    it('should render with classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a CoteacherInvitation component for each coteacher invitation', () => {
      expect(wrapper.find(CoteacherInvitation).length).toBe(coteacherInvitations.length)
    })

    it('should have a SortableList component for all classrooms', () => {
      expect(wrapper.find(SortableList).length).toBe(1);
    })

    it('should render the create a class modal if showModal equals createAClassModal', () => {
      wrapper.instance().setState({ showModal: createAClassModal, })
      expect(wrapper.find(CreateAClassModal).exists()).toBe(true)
    })

    it('should render the rename class modal if showModal equals renameClassModal', () => {
      wrapper.instance().setState({ showModal: renameClassModal, selectedClassroomId: classroomProps[0].id})
      expect(wrapper.find(RenameClassModal).exists()).toBe(true)
    })

    it('should render the change grade modal if showModal equals changeGradeModal', () => {
      wrapper.instance().setState({ showModal: changeGradeModal, selectedClassroomId: classroomProps[0].id})
      expect(wrapper.find(ChangeGradeModal).exists()).toBe(true)
    })

    it('should render the archive class modal if showModal equals archiveClassModal', () => {
      wrapper.instance().setState({ showModal: archiveClassModal, selectedClassroomId: classroomProps[0].id})
      expect(wrapper.find(ArchiveClassModal).exists()).toBe(true)
    })

    it('should render the import google classrooms modal if showModal equals importGoogleClassroomsModal', () => {
      wrapper.instance().setState({ showModal: importGoogleClassroomsModal, })
      expect(wrapper.find(ImportGoogleClassroomsModal).exists()).toBe(true)
    })

    it('should render the import google classroom students modal if showModal equals importGoogleClassroomStudentsModal', () => {
      wrapper.instance().setState({ showModal: importGoogleClassroomStudentsModal, })
      expect(wrapper.find(ImportGoogleClassroomStudentsModal).exists()).toBe(true)
    })

    it('should render the empty google classrooms modal if showModal equals googleClassroomsEmptyModal', () => {
      wrapper.instance().setState({ showModal: googleClassroomsEmptyModal, })
      expect(wrapper.find(GoogleClassroomsEmptyModal).exists()).toBe(true)
    })

    it('should render the google classrooms email modal if showModal equals linkGoogleAccountModal', () => {
      wrapper.instance().setState({ showModal: linkGoogleAccountModal, })
      expect(wrapper.find(LinkGoogleAccountModal).exists()).toBe(true)
    })

    it('should render the import clever classrooms modal if showModal equals importCleverClassroomsModal', () => {
      wrapper.instance().setState({ showModal: importCleverClassroomsModal, })
      expect(wrapper.find(ImportCleverClassroomsModal).exists()).toBe(true)
    })

    it('should render the import clever classroom students modal if showModal equals importCleverClassroomStudentsModal', () => {
      wrapper.instance().setState({ showModal: importCleverClassroomStudentsModal, })
      expect(wrapper.find(ImportCleverClassroomStudentsModal).exists()).toBe(true)
    })

    it('should render the empty clever classrooms modal if showModal equals cleverClassroomsEmptyModal', () => {
      wrapper.instance().setState({ showModal: cleverClassroomsEmptyModal, })
      expect(wrapper.find(CleverClassroomsEmptyModal).exists()).toBe(true)
    })

    it('should render the reauthorize clever modal if showModal equals reauthorizeCleverModal', () => {
      wrapper.instance().setState({ showModal: reauthorizeCleverModal, })
      expect(wrapper.find(ReauthorizeCleverModal).exists()).toBe(true)
    })

    it('should render the invite students modal if showModal equals inviteStudentsModal', () => {
      wrapper.instance().setState({ showModal: inviteStudentsModal, selectedClassroomId: classroomProps[0].id})
      expect(wrapper.find(InviteStudentsModal).exists()).toBe(true)
    })

  })

});
