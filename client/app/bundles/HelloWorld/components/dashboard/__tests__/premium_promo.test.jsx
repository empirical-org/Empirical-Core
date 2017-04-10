import React from 'react';
import { shallow } from 'enzyme';
import MockDate from 'mockdate';

import PremiumPromo from '../premium_promo';

describe('PremiumPromo component', () => {

  it('should render', () => {
    MockDate.set('4/1/17');
    expect(shallow(<PremiumPromo />)).toMatchSnapshot();
  });

  it('should render the correct number of free months', () => {
    MockDate.set('4/1/17');
    expect(shallow(<PremiumPromo />).text()).toMatch('Premium Bonus: 2 Months Free');
    MockDate.set('5/1/17');
    expect(shallow(<PremiumPromo />).text()).toMatch('Premium Bonus: 1 Months Free');
  });

});
