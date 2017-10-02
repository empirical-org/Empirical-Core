import React from 'react';
import { shallow } from 'enzyme';

import CleverSignUp from '../clever_sign_up'

describe('CleverSignUp component', () => {

  it('should render', () => {
    const wrapper = shallow(
        <CleverSignUp />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
