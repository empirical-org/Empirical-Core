import React from 'react';
import { shallow } from 'enzyme';

import ChangeGradeModal from '../change_grade_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('ChangeGradeModal component', () => {

  const wrapper = shallow(
    <ChangeGradeModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
    />
  );

  it('should render ChangeGradeModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
