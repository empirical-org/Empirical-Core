import React from 'react';
import { mount } from 'enzyme';

import Subscriptions from '../Subscriptions';

const sharedProps = {
  premiumCredits: [],
  userAuthorityLevel: null,
  subscriptionStatus: {
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
  }
}

describe('Subscriptions UI state iterations', () => {
  const expiredAttributes = { expiration: '2022-01-1', expired: true }

  describe('trial', () => {
    it('renders when there is an active trial', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Teacher Trial'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired trial', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Teacher Trial' }
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('premium credit', () => {
    it('renders when there is active premium credit', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Premium Credit'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is expired premium credit', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Premium Credit'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('teacher paid', () => {
    const teacherPaidAttributes = { account_type: 'Teacher Paid', payment_method: 'Credit Card', renewal_price: 80 }
    it('renders when there is an active recurring teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...teacherPaidAttributes, recurring: true}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an active non-recurring teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...teacherPaidAttributes, recurring: false}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...teacherPaidAttributes, recurring: false}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('teacher free', () => {
    it('renders when there is an active free teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'Teacher Sponsored Free'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired free teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'Teacher Sponsored Free'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('school paid via stripe', () => {
    const schoolPaidViaStripeAttributes = { account_type: "School Paid (via Stripe)", payment_method: 'Credit Card', renewal_price: 1800 }
    describe('the current user is the purchaser', () => {
      it('renders when there is an active recurring school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaStripeAttributes, recurring: true}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an active non-recurring school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('the current user is not the purchaser', () => {
      it('renders when there is an active recurring school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaStripeAttributes, recurring: true}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an active non-recurring school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

  describe('school paid via invoice', () => {
    const schoolPaidViaInvoiceAttributes = { account_type: "School Paid", payment_method: 'Invoice', renewal_price: 1800 }
    describe('the current user is the purchaser', () => {
      it('renders when there is an active school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('the current user is not the purchaser', () => {
      it('renders when there is an active school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

  describe('school free', () => {
    it('renders when there is an active free school premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: 'School Sponsored Free'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired free school premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: 'School Sponsored Free'}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('district paid via invoice', () => {
    const districtPaidViaInvoiceAttributes = { account_type: "District Paid", payment_method: 'Invoice' }
    describe('the current user is the purchaser', () => {
      it('renders when there is an active district premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...districtPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired district premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...districtPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
    })
    describe('the current user is not the purchaser', () => {
      it('renders when there is an active district premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...districtPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired district premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...districtPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} userAuthorityLevel="purchaser" />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

})
