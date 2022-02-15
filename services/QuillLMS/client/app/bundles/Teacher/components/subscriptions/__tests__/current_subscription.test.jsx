import React from 'react';
import { mount } from 'enzyme';

import { expiredSubscriptionStatus, } from './data'

import CurrentSubscription from '../current_subscription';

describe('CurrentSubscription container', () => {

  it('should render when there is no subscription', () => {
    const wrapper = mount(<CurrentSubscription subscriptionStatus={null} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when the subscription is expired', () => {
    const wrapper = mount(<CurrentSubscription subscriptionStatus={expiredSubscriptionStatus} />);
    expect(wrapper).toMatchSnapshot()
  });
});
