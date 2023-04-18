import { mount } from 'enzyme';
import React from 'react';

import { expiredSubscriptionStatus, } from './data';

import SubscriptionStatus from '../SubscriptionStatus';
import { TEACHER_PREMIUM, } from '../constants';

const sharedProps = {
  userIsContact: false,
  subscriptionType: 'Basic',
}

describe('SubscriptionStatus container', () => {

  it('should render when there is no subscription', () => {
    const wrapper = mount(<SubscriptionStatus {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when the subscription is expired', () => {
    const wrapper = mount(<SubscriptionStatus {...sharedProps} subscriptionStatus={expiredSubscriptionStatus} subscriptionType={TEACHER_PREMIUM} />);
    expect(wrapper).toMatchSnapshot()
  });
});
