import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import ChangeGradeModal from '../change_grade_modal'


describe('ChangeGradeModal component', () => {

  const wrapper = shallow(
    <ChangeGradeModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render ChangeGradeModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
