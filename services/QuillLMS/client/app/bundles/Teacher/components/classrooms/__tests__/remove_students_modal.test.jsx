import React from 'react';
import { shallow } from 'enzyme';

import RemoveStudentsModal from '../remove_students_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('RemoveStudentsModal component', () => {
  const studentIds = [classroomWithStudents.students[0].id, classroomWithStudents.students[1].id]

  const wrapper = shallow(
    <RemoveStudentsModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
      selectedStudentIds={studentIds}
    />
  );

  it('should render RemoveStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
