import React from 'react';
import { shallow } from 'enzyme';

import DashboardFooter from '../dashboard_footer';

describe('DashboardFooter component', () => {
  it('should render', () => {
    const wrapper = shallow(<DashboardFooter />);
    expect(wrapper).toMatchSnapshot();
  });
});
