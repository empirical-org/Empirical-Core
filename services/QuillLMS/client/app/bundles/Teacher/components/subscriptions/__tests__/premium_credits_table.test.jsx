import React from 'react';
import { mount } from 'enzyme';

import PremiumCreditsTable from '../premium_credits_table';

const sharedProps = {
  earnedCredits: 0,
  premiumCredits: [],
}

describe('PremiumCreditsTable container', () => {

  it('should render when there are no premium credits', () => {
    const wrapper = mount(<PremiumCreditsTable {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

});
