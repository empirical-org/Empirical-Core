import React from 'react';
import { shallow } from 'enzyme';

import AccountSettings from '../AccountSettings.jsx';

import StudentAccountForm from '../../components/accounts/edit/student_account_form.jsx'

describe('AccountSettings container', () => {

  it('should render a StudentAccountForm component', () => {
    expect(shallow(<AccountSettings />).find(StudentAccountForm).exists()).toBe(true);
  });

});
