import { shallow } from 'enzyme';
import React from 'react';

import ImportGoogleClassroomStudentsModal from '../import_google_classroom_students_modal';

import { classroomWithStudents } from './test_data/test_data';

describe('ImportGoogleClassroomStudentsModal component', () => {

  const wrapper = shallow(
    <ImportGoogleClassroomStudentsModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render ImportGoogleClassroomStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
