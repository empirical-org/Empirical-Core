import { mount } from 'enzyme';
import React from 'react';

import { FULL } from '../../shared';
import AdminDashboard from '../AdminDashboard';

const sharedProps = {
  passedModel: { teachers: [], schools: [], admin_approval_requests: [] },
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
