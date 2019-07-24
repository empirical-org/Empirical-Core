import React from 'react';
import { shallow } from 'enzyme';

import GoogleSignUp from '../google_sign_up'

describe('GoogleSignUp component', () => {

  it('should render', () => {
    const wrapper = shallow(
        <GoogleSignUp />
    );
    expect(wrapper).toMatchSnapshot();
  });


});
