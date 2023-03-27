import { mount } from 'enzyme';
import * as React from 'react';

import PasswordWrapper from '../password_wrapper';

describe('PasswordWrapper component', () => {

  it('should render', () => {
    const wrapper = mount(
      <PasswordWrapper
        autoComplete="new-password"
        className="password"
        error={null}
        id="password"
        label="Password"
        onChange={() => {}}
        timesSubmitted={0}
        value="password"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
