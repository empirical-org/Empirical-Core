import React from 'react';
import { shallow } from 'enzyme';

import UnitTemplates from '../UnitTemplates.jsx';
import Cms from '../Cms.jsx'

describe('UnitTemplates container', () => {

  it('should render a Cms component', () => {
    const wrapper = shallow(<UnitTemplates />);
    expect(wrapper.find(Cms).exists()).toBe(true);
  });

});
