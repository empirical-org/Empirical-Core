import React from 'react';
import { shallow } from 'enzyme';

import AuthSignUp from '../auth_sign_up';

import GoogleSignUp from '../google_sign_up'
import CleverSignUp from '../clever_sign_up'

describe('AuthSignUp component', () => {

  it('should render <GoogleSignUp/> and <CleverSignUp/>', () => {
      const wrapper = shallow(
        <AuthSignUp />
      );
      expect(wrapper.find(GoogleSignUp).length).toBe(1);
      expect(wrapper.find(CleverSignUp).length).toBe(1);
  });

});
