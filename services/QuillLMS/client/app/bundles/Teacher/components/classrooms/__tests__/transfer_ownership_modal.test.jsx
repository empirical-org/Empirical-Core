import React from 'react';
import { shallow } from 'enzyme';

import TransferOwnershipModal from '../transfer_ownership_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('TransferOwnershipModal component', () => {
  const wrapper = shallow(
    <TransferOwnershipModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
      coteacher={classroomWithStudents.teachers[1]}
    />
  );

  it('should render TransferOwnershipModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
