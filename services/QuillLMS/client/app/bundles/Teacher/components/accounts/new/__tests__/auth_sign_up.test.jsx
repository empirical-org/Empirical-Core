import { shallow } from 'enzyme';
import React from 'react';

import AuthSignUp from '../auth_sign_up';

import AuthGoogleAccessForm from '../../AuthGoogleAccessForm';
import CleverSignUp from '../clever_sign_up';

describe('AuthSignUp component', () => {

  it('should render <GoogleSignUp/> and <CleverSignUp/>', () => {
    const wrapper = shallow(
      <AuthSignUp />
    );
    expect(wrapper.find(AuthGoogleAccessForm)).toHaveLength(1);
    expect(wrapper.find(CleverSignUp)).toHaveLength(1);
  });

});
