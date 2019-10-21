import React from 'react';
import { shallow } from 'enzyme';

import RemoveCoteacherModal from '../remove_coteacher_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('RemoveCoteacherModal component', () => {
  const wrapper = shallow(
    <RemoveCoteacherModal
      classroom={classroomWithStudents}
      close={() => {}}
      coteacher={classroomWithStudents.teachers[1]}
      onSuccess={() => {}}
    />
  );

  it('should render RemoveCoteacherModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
