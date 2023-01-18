import * as React from 'react';
import { mount } from 'enzyme';

import SelectUserType from '../select_user_type';

describe('SelectUserType component', () => {

  it('should render', () => {
    const component = mount(<SelectUserType />);
    expect(component).toMatchSnapshot();
  });
});
