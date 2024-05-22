import { mount } from 'enzyme';
import React from 'react';

import AvailableCredits from '../available_credits';

const sharedProps = {
  availableCredits: 0,
  redeemPremiumCredits: () => {},
  userHasValidSub: false
}

describe('AvailableCredits container', () => {

  it('should render when there are no premium credits', () => {
    const wrapper = mount(<AvailableCredits {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when there are premium credits', () => {
    const wrapper = mount(<AvailableCredits {...sharedProps} availableCredits={28} />);
    expect(wrapper).toMatchSnapshot()
  })

});
