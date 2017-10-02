import React from 'react';
import { shallow } from 'enzyme';

import PremiumPricingGuide from '../PremiumPricingGuide.jsx';

describe('PremiumPricingGuide container', () => {

  it('should render', () => {
    expect(shallow(<PremiumPricingGuide />)).toMatchSnapshot();
  });

});
