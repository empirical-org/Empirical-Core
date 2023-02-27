import React from 'react';
import { mount } from 'enzyme';
import AdminDashboard from '../AdminDashboard';

import { FULL, LIMITED, RESTRICTED, } from '../../shared'

const sharedProps = {
  passedModel: { teachers: [], schools: [] },
  adminId: 7,
}

describe('AdminDashboard container', () => {
  process.env.PUSHER_KEY = 'pusher';

  it('should render with a full access type', () => {
    const wrapper = mount(<AdminDashboard {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with a limited access type', () => {
    const wrapper = mount(<AdminDashboard {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with a restricted access type', () => {
    const wrapper = mount(<AdminDashboard {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

});
