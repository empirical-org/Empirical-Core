import { shallow } from 'enzyme';
import React from 'react';

import ImportProviderClassroomStudentsModal from '../import_provider_classroom_students_modal';

import { classroomWithStudents } from './test_data/test_data';

describe('ImportProviderClassroomStudentsModal component', () => {

  const wrapper = shallow(
    <ImportProviderClassroomStudentsModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
      provider='Google'
    />
  );

  it('should render ImportProviderClassroomStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
