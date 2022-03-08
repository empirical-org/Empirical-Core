import React from 'react';
import { mount } from 'enzyme';

import SubscriptionHistory from '../subscription_history';

const sharedProps = {
  authorityLevel: null,
  premiumCredits: [],
  subscriptions: []
}

describe('SubscriptionHistory container', () => {

  it('should render when there is no subscription history', () => {
    const wrapper = mount(<SubscriptionHistory {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

});
