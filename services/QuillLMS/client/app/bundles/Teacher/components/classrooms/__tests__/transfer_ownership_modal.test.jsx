import { shallow } from 'enzyme';
import React from 'react';

import TransferOwnershipModal from '../transfer_ownership_modal';

import { classroomWithStudents } from './test_data/test_data';

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
