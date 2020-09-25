import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import TransferOwnershipModal from '../transfer_ownership_modal'


describe('TransferOwnershipModal component', () => {
  const wrapper = shallow(
    <TransferOwnershipModal
      classroom={classroomWithStudents}
      close={() => {}}
      coteacher={classroomWithStudents.teachers[1]}
      onSuccess={() => {}}
    />
  );

  it('should render TransferOwnershipModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
