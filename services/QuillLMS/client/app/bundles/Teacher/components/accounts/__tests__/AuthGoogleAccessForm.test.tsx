import * as React from 'react';
import { shallow } from 'enzyme';

import AuthGoogleAccessForm from "../AuthGoogleAccessForm"

describe('AuthGoogleAccessForm component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AuthGoogleAccessForm text='Sign me up' />
    );
    expect(wrapper).toMatchSnapshot();
  });


});
