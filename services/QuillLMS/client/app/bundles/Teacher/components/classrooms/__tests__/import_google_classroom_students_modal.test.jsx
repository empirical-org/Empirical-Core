import { shallow } from 'enzyme';
import React from 'react';


import { classroomWithStudents } from './test_data/test_data';

describe('importGoogleClassroomStudentsModal component', () => {

  const wrapper = shallow(
    <importGoogleClassroomStudentsModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render importGoogleClassroomStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
