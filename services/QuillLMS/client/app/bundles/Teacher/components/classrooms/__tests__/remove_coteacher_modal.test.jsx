import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import RemoveCoteacherModal from '../remove_coteacher_modal'


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
