import { mount } from 'enzyme';
import React from 'react';

import { expiredSubscriptionStatus } from './data';

import {
    SCHOOL_PREMIUM
} from '../constants';
import CurrentSubscription from '../current_subscription';

const sharedProps = {
  "authorityLevel": null,
  "purchaserNameOrEmail": "emilia+3@quill.org",
  "subscriptionStatus":  {
    "id": 7,
    "expiration": '2070-01-01',
    "created_at": "2022-02-16T14: 07: 25.976Z",
    "updated_at": "2022-02-16T14: 07: 25.976Z",
    "account_type": "School Paid",
    "lastFour": null,
    "purchaser_email": "emilia+3@quill.org",
    "start_date": "2022-02-16",
    "subscription_type_id": null,
    "purchaser_id": null,
    "recurring": false,
    "de_activated_date": null,
    "payment_method": null,
    "payment_amount": null,
    "expired": false,
    "purchaser_name": null,
    "mail_to": "emilia+3@quill.org",
    "renewal_price": null
  },
  "subscriptionType": SCHOOL_PREMIUM,
  "userIsContact": false
}

describe('CurrentSubscription container', () => {

  it('should render when there is no subscription', () => {
    const wrapper = mount(<CurrentSubscription subscriptionStatus={null} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when the subscription is expired', () => {
    const wrapper = mount(<CurrentSubscription subscriptionStatus={expiredSubscriptionStatus} />);
    expect(wrapper).toMatchSnapshot()
  });

  describe('when there is a current subscription', () => {
    it('should render when there is a purchaserNameOrEmail', () => {
      const wrapper = mount(<CurrentSubscription {...sharedProps} />);
      expect(wrapper).toMatchSnapshot()
    });

    it('should render when there is no purchaserNameOrEmail', () => {
      const wrapper = mount(<CurrentSubscription {...sharedProps} purchaserNameOrEmail={null} />);
      expect(wrapper).toMatchSnapshot()
    });

    it('should render when the purchaserNameOrEmail is an empty string', () => {
      const wrapper = mount(<CurrentSubscription {...sharedProps} purchaserNameOrEmail="" />);
      expect(wrapper).toMatchSnapshot()
    });

  })
});
