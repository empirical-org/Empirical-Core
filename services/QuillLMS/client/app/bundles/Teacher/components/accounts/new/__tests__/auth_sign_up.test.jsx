import React from 'react';
import { shallow } from 'enzyme';

import AuthSignUp from '../auth_sign_up';

import CleverSignUp from '../clever_sign_up'
import AuthGoogleAccessForm from '../../AuthGoogleAccessForm';

describe('AuthSignUp component', () => {

  it('should render <GoogleSignUp/> and <CleverSignUp/>', () => {
    const wrapper = shallow(
      <AuthSignUp />
    );
    expect(wrapper.find(AuthGoogleAccessForm)).toHaveLength(1);
    expect(wrapper.find(CleverSignUp)).toHaveLength(1);
  });

});
