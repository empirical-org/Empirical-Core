import React from 'react';
import { mount } from 'enzyme';

import GrowthDiagnosticsPromotionCard from '../growth_diagnostics_promotion_card';

describe('GrowthDiagnosticsPromotionCard component', () => {

  it('should render', () => {
    const wrapper = mount(<GrowthDiagnosticsPromotionCard />);
    expect(wrapper).toMatchSnapshot()
  });

});
