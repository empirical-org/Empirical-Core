import React from 'react';
import { shallow } from 'enzyme';
import AdminDashboard from 'bundles/admin_dashboard/containers/AdminDashboard';
import AdminsTeachers from 'bundles/admin_dashboard/components/adminsTeachers';

describe('AdminDashboard container', () => {
  process.env.PUSHER_KEY = 'pusher';
  const wrapper = shallow(<AdminDashboard id={7} />);
  wrapper.setState({ loading: false });

  describe('AdminsTeachers component', () => {
    it('should render', () => {
      expect(wrapper.find(AdminsTeachers).exists()).toBe(true);
    });
  });

  it('receiveData function should set loading to false and modal to data', () => {
    wrapper.instance().receiveData('wumbo');
    expect(wrapper.state().model).toBe('wumbo');
    expect(wrapper.state().loading).toBe(false);
  });
});
