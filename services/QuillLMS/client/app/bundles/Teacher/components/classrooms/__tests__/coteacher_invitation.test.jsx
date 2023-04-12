import { shallow } from 'enzyme';
import React from 'react';

import CoteacherInvitation from '../coteacher_invitation';

import { coteacherInvitations } from './test_data/test_data';

describe('CoteacherInvitation component', () => {

  const wrapper = shallow(
    <CoteacherInvitation
      coteacherInvitation={coteacherInvitations[0]}
      getClassroomsAndCoteacherInvitations={() => {}}
      showSnackbar={() => {}}
    />
  );

  it('should render CoteacherInvitation', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
