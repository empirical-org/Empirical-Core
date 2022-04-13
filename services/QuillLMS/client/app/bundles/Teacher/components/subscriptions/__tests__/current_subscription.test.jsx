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

  describe('when there is a current subscription', () => {
    const sharedProps = {
      "authorityLevel": null,
      "purchaserNameOrEmail": "emilia+3@quill.org",
      "subscriptionStatus":  {
        "id": 7,
        "expiration": "2023-07-31",
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
        "mail_to": "emilia+3@quill.org"
      },
      "subscriptionType": "School Premium",
      "userIsContact": false
    }

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
