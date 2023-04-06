import { shallow } from 'enzyme';
import React from 'react';

import LeavingModal from '../leaving_modal';

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
