import React from 'react';
import { shallow } from 'enzyme';

import RoleOption from '../role_option';

it('should render a button', () => {
    const wrapper = shallow(
        <RoleOption selectRole={() => null} role={'student'} />
    );
    expect(wrapper).toMatchSnapshot();
});
