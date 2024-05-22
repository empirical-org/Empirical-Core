import { shallow } from 'enzyme';
import React from 'react';

import { AppLegend } from '../app_legend.tsx';

describe('AppLegend component', () => {

  it('should render', () => {
    const wrapper = shallow(<AppLegend />)
    expect(wrapper).toMatchSnapshot();
  });

})
