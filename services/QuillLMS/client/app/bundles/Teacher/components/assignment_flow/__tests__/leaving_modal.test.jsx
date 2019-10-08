import React from 'react';
import { shallow } from 'enzyme';

import LeavingModal from '../move_students_modal'

describe('LeavingModal component', () => {
  const wrapper = shallow(
    <LeavingModal
      cancel={() => {}}
    />
  );

  it('should render LeavingModal', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
