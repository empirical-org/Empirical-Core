import React from 'react';
import { shallow } from 'enzyme';

import RoleOption from '../role_option';

describe('RoleOption component', () => {
  it('should render a button', () => {
      const wrapper = shallow(
          <RoleOption selectRole={() => null} role={'student'} />
      );
      expect(wrapper).toMatchSnapshot();
  });
  it('should say whatever is in its role prop', () => {
      const wrapper = shallow(
          <RoleOption selectRole={() => null} role={'student'} />
      );
      expect(wrapper.text()).toBe('Student');
  });
  it('should have an onClick event equal to whatever is in its selectRole prop', () => {
    const mockClick = jest.fn();
    const wrapper = shallow(
        <RoleOption selectRole={mockClick} role={'student'} />
    );
    wrapper.find('button').simulate('click');
    expect(mockClick.mock.calls).toHaveLength(1);
  });
});
