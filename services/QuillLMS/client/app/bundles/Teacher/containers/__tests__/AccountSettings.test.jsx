import React from 'react';
import { shallow } from 'enzyme';

import StudentAccount from '../StudentAccount.jsx';

import StudentGeneralAccountInfo from '../../components/accounts/edit/student_general.jsx'

describe('StudentAccount container', () => {

  it('should render a StudentAccountForm component', () => {
    expect(shallow(<StudentAccount />).find(StudentGeneralAccountInfo).exists()).toBe(true);
  });

});
