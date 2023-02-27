import * as React from 'react';
import { mount } from 'enzyme';
import qs from 'qs'

import VerifyEmail from '../verify_email';

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
}))

const user = {
  name: 'User Name',
  email: 'username@quill.org'
}

const location = {
  search: ''
}

describe('VerifyEmail component', () => {

  it('should render', () => {
    const component = mount(<VerifyEmail location={location} user={user} />);
    expect(component).toMatchSnapshot();
  });
});
