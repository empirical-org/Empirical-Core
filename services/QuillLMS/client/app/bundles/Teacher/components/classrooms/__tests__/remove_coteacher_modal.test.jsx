import React from 'react';
import { shallow } from 'enzyme';

import RemoveCoteacherModal from '../remove_coteacher_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('RemoveCoteacherModal component', () => {
  const wrapper = shallow(
    <RemoveCoteacherModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
      coteacher={classroomWithStudents.teachers[1]}
    />
  );

  it('should render RemoveCoteacherModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
