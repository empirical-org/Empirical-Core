import React from 'react';
import { mount } from 'enzyme';

import { expiredSubscriptionStatus, } from './data'

import SubscriptionStatus from '../SubscriptionStatus';

const sharedProps = {
  userIsContact: false,
  subscriptionType: 'Basic',
  showPurchaseModal: () => {}
}

describe('SubscriptionStatus container', () => {

  it('should render when there is no subscription', () => {
    const wrapper = mount(<SubscriptionStatus {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when the subscription is expired', () => {
    const wrapper = mount(<SubscriptionStatus {...sharedProps} subscriptionStatus={expiredSubscriptionStatus} subscriptionType="Teacher Premium" />);
    expect(wrapper).toMatchSnapshot()
  });
});
