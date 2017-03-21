import React from 'react';
import { shallow } from 'enzyme';

import SelectRole from '../select_role';

describe('SelectRole component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <SelectRole role={'teacher'} updateRole={() => null} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the updateRole prop on select value change', () => {
    const mockSelect = jest.fn();
    const wrapper = shallow(
      <SelectRole role={'teacher'} updateRole={mockSelect} />
    );
    wrapper.find('select').simulate('change', { target: { value : 'staff' }});
    expect(mockSelect.mock.calls).toHaveLength(1);
  });

});
