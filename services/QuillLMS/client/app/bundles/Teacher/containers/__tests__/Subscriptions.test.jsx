import React from 'react';
import { mount } from 'enzyme';

import Subscriptions from '../Subscriptions';
import {
  TEACHER_TRIAL,
  PREMIUM_CREDIT,
  TEACHER_SPONSORED_FREE,
  TEACHER_PAID,
  COLLEGE_BOARD_EDUCATOR_LIFETIME_PREMIUM,
  SCHOOL_PAID,
  SCHOOL_PAID_VIA_STRIPE,
  SCHOOL_SPONSORED_FREE,
  SCHOOL_DISTRICT_PAID,
  CREDIT_CARD
} from '../../components/subscriptions/constants'

const TEACHER_RENEWAL_PRICE = 80
const SCHOOL_RENEWAL_PRICE = 1800

const sharedProps = {
  premiumCredits: [],
  userAuthorityLevel: null,
  subscriptionStatus: {
    "id": 7,
    "expiration": '2070-01-01',
    "created_at": "2022-02-16T14: 07: 25.976Z",
    "updated_at": "2022-02-16T14: 07: 25.976Z",
    "account_type": SCHOOL_PAID,
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
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: TEACHER_TRIAL}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired trial', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: TEACHER_TRIAL }
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('premium credit', () => {
    it('renders when there is active premium credit', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: PREMIUM_CREDIT}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is expired premium credit', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: PREMIUM_CREDIT}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('teacher paid', () => {
    const teacherPaidAttributes = { account_type: TEACHER_PAID, payment_method: CREDIT_CARD, renewal_price: TEACHER_RENEWAL_PRICE }
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
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: TEACHER_SPONSORED_FREE}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired free teacher premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: TEACHER_SPONSORED_FREE}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('school paid via stripe', () => {
    const schoolPaidViaStripeAttributes = { account_type: SCHOOL_PAID_VIA_STRIPE, payment_method: CREDIT_CARD, renewal_price: SCHOOL_RENEWAL_PRICE }
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
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an active non-recurring school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaStripeAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

  describe('school paid via invoice', () => {
    const schoolPaidViaInvoiceAttributes = { account_type: SCHOOL_PAID, payment_method: 'Invoice', renewal_price: SCHOOL_RENEWAL_PRICE }
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
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired school premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...schoolPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

  describe('school free', () => {
    it('renders when there is an active free school premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, account_type: SCHOOL_SPONSORED_FREE}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
    it('renders when there is an expired free school premium subscription', () => {
      const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, account_type: SCHOOL_SPONSORED_FREE}
      const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('district paid via invoice', () => {
    const districtPaidViaInvoiceAttributes = { account_type: SCHOOL_DISTRICT_PAID, payment_method: 'Invoice' }
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
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })
      it('renders when there is an expired district premium subscription', () => {
        const subscriptionStatus = { ...sharedProps.subscriptionStatus, ...expiredAttributes, ...districtPaidViaInvoiceAttributes, recurring: false}
        const wrapper = mount(<Subscriptions {...sharedProps} subscriptions={[subscriptionStatus]} subscriptionStatus={subscriptionStatus} />);
        expect(wrapper).toMatchSnapshot()
      })

    })
  })

})
