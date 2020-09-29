import React from 'react';
import { shallow } from 'enzyme';

import ClassroomTeacherSection, {
  inviteCoteachersModal,
  removeCoteacherModal,
  transferOwnershipModal
} from '../classroom_teacher_section'

import RemoveCoteacherModal from '../remove_coteacher_modal'
import TransferOwnershipModal from '../transfer_ownership_modal'
import InviteCoteachersModal from '../invite_coteachers_modal'

import { DataTable } from '../../../../Shared/index'

import { classroomWithStudents, userProps, classroomProps } from './test_data/test_data'

describe('ClassroomTeacherSection component', () => {

  const wrapper = shallow(
    <ClassroomTeacherSection
      classroom={classroomWithStudents}
      classrooms={classroomProps}
      isOwnedByCurrentUser
      user={userProps}
    />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a data table', () => {
    expect(wrapper.find(DataTable).exists()).toBe(true)
  })

  it('should render the RemoveCoteacherModal if showModal === removeCoteacherModal', () => {
    wrapper.instance().removeCoteacher(classroomWithStudents.teachers[1].id)
    expect(wrapper.find(RemoveCoteacherModal).exists()).toBe(true)
  })

  it('should render the InviteCoteachersModal if showModal === inviteCoteachersModal', () => {
    wrapper.instance().inviteCoteachers(classroomWithStudents.teachers[1].id)
    expect(wrapper.find(InviteCoteachersModal).exists()).toBe(true)
  })

  it('should render the TransferOwnershipModal if showModal === transferOwnershipModal', () => {
    wrapper.instance().transferOwnership(classroomWithStudents.teachers[1].id)
    expect(wrapper.find(TransferOwnershipModal).exists()).toBe(true)
  })

});
