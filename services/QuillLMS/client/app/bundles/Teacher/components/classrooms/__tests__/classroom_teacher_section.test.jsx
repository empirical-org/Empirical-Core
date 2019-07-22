import React from 'react';
import { shallow } from 'enzyme';

import ClassroomTeacherSection from '../classroom_teacher_section'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { classroomWithStudents, userProps } from './test_data/test_data'

describe('ClassroomTeacherSection component', () => {

  const wrapper = shallow(
    <ClassroomTeacherSection classroom={classroomWithStudents} user={userProps} />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a DataTable', () => {
    expect(wrapper.find(DataTable).exists()).toBe(true)
  })

})
