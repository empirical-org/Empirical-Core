import React from 'react';
import { mount } from 'enzyme';

import { expiredSubscriptionStatus, } from './data'

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
    "mail_to": "emilia+3@quill.org"
  },
  "subscriptionType": "School Premium",
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

  describe('UI state iterations', () => {
    const expiredAttributes = { expiration: '2022-01-1', expired: true }
    describe('trial', () => {
      it('renders when there is an active trial', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Teacher Trial'}
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium Trial" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired trial', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Teacher Trial' }
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium Trial" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('premium credit', () => {
      it('renders when there is active premium credit', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Premium Credit'}
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium Credit" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is expired premium credit', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Premium Credit'}
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium Credit" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('teacher paid', () => {
      it('renders when there is an active recurring teacher premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Teacher Paid', payment_method: 'Credit Card', recurring: true}
        const wrapper = mount(<CurrentSubscription {...sharedProps} authorityLevel="purchaser" subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an active non-recurring teacher premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Teacher Paid', payment_method: 'Credit Card', recurring: false}
        const wrapper = mount(<CurrentSubscription {...sharedProps} authorityLevel="purchaser" subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired teacher premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Teacher Paid', payment_method: 'Credit Card', recurring: false}
        const wrapper = mount(<CurrentSubscription {...sharedProps} authorityLevel="purchaser" subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('teacher free', () => {
      it('renders when there is an active free teacher premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'College Board Educator Lifetime Premium'}
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired free teacher premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'College Board Educator Lifetime Premium'}
        const wrapper = mount(<CurrentSubscription {...sharedProps} subscriptionStatus={subscriptionStatus} subscriptionType="Teacher Premium" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
});
