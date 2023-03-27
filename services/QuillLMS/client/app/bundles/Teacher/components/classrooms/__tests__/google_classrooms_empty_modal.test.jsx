import { shallow } from 'enzyme';
import React from 'react';

import GoogleClassroomsEmptyModal from '../google_classrooms_empty_modal';

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
