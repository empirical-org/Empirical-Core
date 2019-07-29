import React from 'react';
import { shallow } from 'enzyme';

import ClassroomTeacherSection from '../classroom_teacher_section'
import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { classroomWithoutStudents, userProps } from './test_data/test_data'

describe('ClassroomTeacherSection component', () => {

  const wrapper = shallow(
    <ClassroomTeacherSection
      isOwnedByCurrentUser
      classroom={classroomWithoutStudents}
      user={userProps}
    />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a data table', () => {
    expect(wrapper.find(DataTable).exists()).toBe(true)
  })

});
