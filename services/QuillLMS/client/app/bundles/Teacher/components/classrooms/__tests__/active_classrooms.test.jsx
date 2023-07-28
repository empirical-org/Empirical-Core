import { shallow } from 'enzyme';
import React from 'react';

import { classroomProps, coteacherInvitations, userProps } from './test_data/test_data';

import { SortableList } from '../../../../Shared/index';
import ActiveClassrooms, {
  archiveClassModal,
  changeGradeModal,
  cleverClassroomsEmptyModal,
  createAClassModal,
  importCleverClassroomStudentsModal,
  importCleverClassroomsModal,
  importGoogleClassroomsModal,
  inviteStudentsModal,
  linkProviderAccountModal,
  noClassroomsToImportModal,
  reauthorizeProviderModal,
  renameClassModal
} from '../active_classrooms.tsx';
import ArchiveClassModal from '../archive_classroom_modal';
import ChangeGradeModal from '../change_grade_modal';
import CleverClassroomsEmptyModal from '../clever_classrooms_empty_modal';
import CoteacherInvitation from '../coteacher_invitation';
import CreateAClassModal from '../create_a_class_modal';
import NoClassroomsToImportModal from '../no_classrooms_to_import_modal';
import ImportProviderClassroomStudentsModal from '../import_provider_classroom_students_modal';
import ImportProviderClassroomsModal from '../import_provider_classrooms_modal';
import InviteStudentsModal from '../invite_students_modal';
import LinkProviderAccountModal from '../link_provider_account_modal';
import ReauthorizeProviderModal from '../reauthorize_provider_modal';
import RenameClassModal from '../rename_classroom_modal';

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

    it('should render the import classrooms modal if showModal equals importProviderClassroomsModal', () => {
      wrapper.instance().setState({ showModal: importProviderClassroomsModal, })
      expect(wrapper.find(ImportProviderClassroomsModal).exists()).toBe(true)
    })

    it('should render the import classroom students modal if showModal equals importProviderClassroomStudentsModal', () => {
      wrapper.instance().setState({ showModal: importProviderClassroomStudentsModal, })
      expect(wrapper.find(ImportProviderClassroomStudentsModal).exists()).toBe(true)
    })

    it('should render the no classrooms to import modal if showModal equals googleClassroomsEmptyModal', () => {
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
