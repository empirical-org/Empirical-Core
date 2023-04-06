import { shallow } from 'enzyme';
import React from 'react';

import { classroomWithStudents } from './test_data/test_data';



describe('importCleverClassroomStudentsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  const wrapper = shallow(
    <importCleverClassroomStudentsModal
      classroom={classroomWithStudents}
      close={close}
      onSuccess={onSuccess}
    />
  );

  it('should render importCleverClassroomStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
