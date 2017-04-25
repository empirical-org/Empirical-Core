import React from 'react';
import { shallow } from 'enzyme';

import AccountSettings from '../AccountSettings.jsx';

import UserAccessibleSelectRole from '../../components/accounts/edit/user_accessible_select_role.jsx'

describe('AccountSettings container', () => {

  it('should render a UserAccessibleSelectRole component', () => {
    expect(shallow(<AccountSettings />).find(UserAccessibleSelectRole).exists()).toBe(true);
  });

});
