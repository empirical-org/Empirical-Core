import React from 'react';
import { shallow } from 'enzyme';
import MockDate from 'mockdate';

import PremiumPromo from '../premium_promo';

describe('PremiumPromo component', () => {
  it('should render', () => {
    expect(shallow(<PremiumPromo />)).toMatchSnapshot();
  });
});
