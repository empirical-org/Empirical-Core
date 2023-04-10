import { mount } from 'enzyme';
import * as React from 'react';

import SelectUserType from '../select_user_type';

describe('SelectUserType component', () => {

  it('should render', () => {
    const component = mount(<SelectUserType />);
    expect(component).toMatchSnapshot();
  });
});
