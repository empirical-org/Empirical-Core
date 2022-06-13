import React from 'react';
import { shallow } from 'enzyme';

import CleverClassroomsEmptyModal from '../clever_classrooms_empty_modal'

describe('CleverClassroomsEmptyModal component', () => {
  const close = () => {}

  const wrapper = shallow(
    <CleverClassroomsEmptyModal
      close={close}
    />
  );

  it('should render CleverClassroomsEmptyModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
