import React from 'react';
import { mount } from 'enzyme';

import DailyTinyTip from '../daily_tiny_tip';

jest.spyOn(global.Date, 'now').mockImplementation(() =>
  new Date('2020-04-08T11:01:58.135Z').valueOf()
);

describe('DailyTinyTip component', () => {

  it('should render', () => {
    const wrapper = mount(<DailyTinyTip />);
    expect(wrapper).toMatchSnapshot()
  });

});
