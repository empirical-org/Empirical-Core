import { shallow } from 'enzyme';
import React from 'react';

import StudentAccount from '../StudentAccount.jsx';

import StudentGeneralAccountInfo from '../../components/accounts/edit/student_general.jsx';
import StudentPasswordAccountInfo from '../../components/accounts/edit/update_password.jsx';

describe('StudentAccount container', () => {
  const container = shallow(<StudentAccount name="Pablo Vittar" />);
  it('should render a StudentAccountForm component', () => {
    expect(container.find(StudentGeneralAccountInfo).exists()).toBe(true);
    expect(container.find(StudentPasswordAccountInfo).exists()).toBe(true);
  });
});
