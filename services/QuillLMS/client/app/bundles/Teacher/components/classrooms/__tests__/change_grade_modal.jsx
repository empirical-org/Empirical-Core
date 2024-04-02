import { shallow } from 'enzyme';
import React from 'react';

import ChangeGradeModal from '../change_grade_modal';

import { classroomWithStudents } from './test_data/test_data';

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
