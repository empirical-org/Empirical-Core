import { mount } from 'enzyme';
import * as React from 'react'

import { classroomProps, coteacherInvitations, googleUserProps, userProps } from './test_data/test_data';

import { SortableList } from '../../../../Shared/index';
import ActiveClassrooms from '../active_classrooms';
import ArchiveClassModal from '../archive_classroom_modal';
import ChangeGradeModal from '../change_grade_modal';
import CoteacherInvitation from '../coteacher_invitation';
import CreateAClassModal from '../create_a_class_modal';
import ImportProviderClassroomStudentsModal from '../import_provider_classroom_students_modal';
import ImportProviderClassroomsModal from '../import_provider_classrooms_modal';
import InviteStudentsModal from '../invite_students_modal';
import LinkProviderAccountModal from '../link_provider_account_modal';
import NoClassroomsToImportModal from '../no_classrooms_to_import_modal';
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

    const wrapper = mount(
      <ActiveClassrooms
        canvasLink=''
        classrooms={[]}
        cleverLink=''
        coteacherInvitations={[]}
        googleLink=''
        user={userProps}
      />
    );

    it('should render with no classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a no active classes div', () => {
      expect(wrapper.find('.no-active-classes').exists()).toBe(true);
    })

  })

  describe('with classrooms', () => {
    const wrapper = mount(
      <ActiveClassrooms
        canvasLink=''
        classrooms={classroomProps}
        cleverLink=''
        coteacherInvitations={coteacherInvitations}
        googleLink=''
        user={userProps}
      />
    );

    wrapper.find('img.expand-arrow').at(0).simulate('click')

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
      wrapper.find('button.create-a-class-button').simulate('click')
      expect(wrapper.find(CreateAClassModal).exists()).toBe(true)
    })

    it('should render the rename class modal', () => {
      wrapper.find('button').filterWhere(node => node.text() === 'Rename class').simulate('click');
      expect(wrapper.find(RenameClassModal).exists()).toBe(true)
    })

    it('should render the change grade modal', () => {
      wrapper.find('button').filterWhere(node => node.text() === 'Change grade').simulate('click');
      expect(wrapper.find(ChangeGradeModal).exists()).toBe(true)
    })

    it('should render the archive class modal if showModal equals archiveClassModal', () => {
      wrapper.find('button').filterWhere(node => node.text() === 'Archive').simulate('click');
      expect(wrapper.find(ArchiveClassModal).exists()).toBe(true)
    })

    it('should render the LinkProviderAccountModal if user clicks Import from [Provider] and does not have account', () => {
      wrapper.find('button').filterWhere(node => node.text() === 'Import from Canvas').simulate('click');
      expect(wrapper.find(LinkProviderAccountModal).exists()).toBe(true)
    })
  })

  // it('should render the import classrooms modal', () => {
  //   wrapper.find('button').filterWhere(node => node.text() === 'Import from Google').simulate('click');
  //   expect(wrapper.find(ImportProviderClassroomsModal).exists()).toBe(true)
  // })

  // it('should render the import classroom students modal if showModal equals importProviderClassroomStudentsModal', () => {
  //   wrapper.instance().setState({ showModal: importProviderClassroomStudentsModal, })
  //   expect(wrapper.find(ImportProviderClassroomStudentsModal).exists()).toBe(true)
  // })

  // it('should render the reauthorize clever modal if showModal equals reauthorizeProviderModal', () => {
  //   wrapper.instance().setState({ showModal: reauthorizeProviderModal, })
  //   expect(wrapper.find(ReauthorizeProviderModal).exists()).toBe(true)
  // })

  // it('should render the invite students modal if showModal equals inviteStudentsModal', () => {
  //   wrapper.find('button').filterWhere(node => node.text() === 'Invite students').simulate('click');
  //   expect(wrapper.find(InviteStudentsModal).exists()).toBe(true)
  // })

  // it('should render the no classrooms to import modal', () => {
  //   wrapper.find('button').filterWhere(node => node.text() === 'Import from Canvas').simulate('click');
  //   expect(wrapper.find(ImportProviderClassroomsModal).exists()).toBe(true)
  // })

});
