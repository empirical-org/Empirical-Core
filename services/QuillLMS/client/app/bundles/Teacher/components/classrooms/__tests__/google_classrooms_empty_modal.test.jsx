import React from 'react';
import { shallow } from 'enzyme';

import GoogleClassroomsEmptyModal from '../google_classrooms_empty_modal'

describe('GoogleClassroomsEmptyModal component', () => {

  const wrapper = shallow(
    <GoogleClassroomsEmptyModal
      close={() => {}}
    />
  );

  it('should render GoogleClassroomsEmptyModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
