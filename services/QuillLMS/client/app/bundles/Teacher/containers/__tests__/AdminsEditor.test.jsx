import { shallow } from 'enzyme';
import React from 'react';

import AdminsEditor from '../AdminsEditor.jsx';

import Cms from '../Cms.jsx';

describe('AdminsEditor container', () => {
  const wrapper = shallow(<AdminsEditor />);

  it('should render a Cms component for admins', () => {
    expect(wrapper.find(Cms).exists()).toBe(true);
    expect(wrapper.find(Cms).props().resourceNameSingular).toBe('admin');
    expect(wrapper.find(Cms).props().resourceNamePlural).toBe('admins');
  });

});
