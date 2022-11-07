import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

import {
  TEACHER_PREMIUM_TRIAL,
  TEACHER_PREMIUM_CREDIT,
  TEACHER_PREMIUM_SCHOLARSHIP,
  TEACHER_PREMIUM,
  SCHOOL_PREMIUM,
  SCHOOL_PREMIUM_SCHOLARSHIP,
  DISTRICT_PREMIUM
} from './constants';

import StripeSubscriptionCheckoutSessionButton from '../shared/StripeSubscriptionCheckoutSessionButton';

const CTA_BUTTON_CLASSNAME = "quill-button medium contained primary focus-on-light"

const quillBasicCopy = (
  <span>
    Quill Basic provides access to all of Quill&apos;s content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription.
  </span>);

function schoolPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact) {
  if (remainingDays < 0) { return expiredCopy(subscriptionType, subscriptionStatus, userIsContact) }

  return (
    <span>
      With {subscriptionType}, you will have access to all of Quill’s
      free reports as well as additional advanced reporting. You will also
      be able to view and print reports of your students’ progress. Our
      advanced reports support concept, Common Core, and overall progress
      analysis. <a className="green-link" href="https://support.quill.org/quill-premium">Here’s more information</a> about your {subscriptionType} features.
    </span>
  )
};

function teacherPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact) {
  if (remainingDays < 0) { return expiredCopy(subscriptionType, subscriptionStatus) }

  return (
    <span>
      With {subscriptionType}, you will have access to all of Quill’s free reports as well as additional advanced reporting.
      You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis.
      <a className="green-link" href="https://support.quill.org/quill-premium"> Here’s more information</a> about your {subscriptionType} features.
    </span>
  )
};

function expiredCopy(subscriptionType, subscriptionStatus, userIsContact) {
  const { purchaser_email, purchaser_name, } = subscriptionStatus

  const expiration = moment(subscriptionStatus.expiration)
  const dateFormat = "MM/DD/YY"
  const formattedStartDate = subscriptionStatus && moment(subscriptionStatus.start_date).format(dateFormat)
  const formattedExpirationDate = expiration && expiration.format(dateFormat)

  let billingContact

  if (!userIsContact && purchaser_email) {
    const billingContactEmailLink = <a href={`mailto:${purchaser_email}`}>{purchaser_email}</a>
    const billingContactContent = purchaser_name ? <React.Fragment>{purchaser_name} ({billingContactEmailLink})</React.Fragment> : billingContactEmailLink
    billingContact = <React.Fragment><br /><br />The billing contact for your subscription is <strong>{billingContactContent}.</strong></React.Fragment>
  }

  return (
    <span>
      <strong>Your {subscriptionType} subscription ({formattedStartDate} - {formattedExpirationDate}) has expired and you are back to Quill Basic.</strong>
      {quillBasicCopy}
      {billingContact}
    </span>
  )
}

const SubscriptionStatus = ({
  subscriptionStatus,
  subscriptionType,
  userIsContact,
  customerEmail,
}) => {

  const renewalStripePriceId = subscriptionStatus && subscriptionStatus.renewal_stripe_price_id
  const schoolIds = subscriptionStatus && JSON.stringify(subscriptionStatus.school_ids)

  let image
  let expiration
  let remainingDays

  let subscriptionTypeText = subscriptionType;

  if (subscriptionType !== 'Basic') {
    expiration = moment(subscriptionStatus.expiration);
    remainingDays = expiration.diff(moment(Date.now()), 'days');
  }

  const content = {
    status: <h2>{`You have a ${subscriptionTypeText} subscription`}<img alt={`${subscriptionTypeText}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>,
    buttonOrDate: expiration && (
      <span className="expiration-date">
        <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
      </span>
    )
  };

  switch (subscriptionType) {
    case 'Basic':
      image = 'basic_icon.png';
      content.premiumCopy = quillBasicCopy;
      content.boxColor = '#00c2a2';
      content.buttonOrDate = <a className={CTA_BUTTON_CLASSNAME} href="/premium">Learn more about Quill Premium</a>;
      subscriptionTypeText = 'Quill Basic';
      content.status = <h2>{`You have a ${subscriptionType} subscription`}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      break;
    case TEACHER_PREMIUM_TRIAL:
    case TEACHER_PREMIUM_CREDIT:
    case TEACHER_PREMIUM_SCHOLARSHIP:
      content.premiumCopy = teacherPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact);
      image = 'teacher_premium_icon.png';
      const teacherSubDisplayName = subscriptionType === TEACHER_PREMIUM_SCHOLARSHIP ? TEACHER_PREMIUM : subscriptionType
      content.status = <h2>You have a {teacherSubDisplayName} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>
      content.boxColor = '#348fdf'
      if (remainingDays < 0) {
        content.buttonOrDate = <a className={CTA_BUTTON_CLASSNAME} href="/premium">Subscribe to premium</a>
      }
      break;
    case TEACHER_PREMIUM:
      content.premiumCopy = teacherPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact);
      image = 'teacher_premium_icon.png';
      content.status = <h2>You have a {subscriptionType} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>
      content.boxColor = '#348fdf'
      if (remainingDays < 0) {
        content.buttonOrDate = (
          <StripeSubscriptionCheckoutSessionButton
            buttonClassName={CTA_BUTTON_CLASSNAME}
            buttonText='Renew subscription'
            cancelPath='subscriptions'
            customerEmail={subscriptionStatus.customer_email}
            stripePriceId={renewalStripePriceId}
            userIsEligibleForNewSubscription={true}
            userIsSignedIn={true}
          />
        )
      }
      break;
    case SCHOOL_PREMIUM:
      content.premiumCopy = schoolPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact);
      image = 'school_premium_icon.png';
      content.status = <h2>You have a {subscriptionType} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      content.boxColor = '#9c2bde';
      if (remainingDays < 0) {
        content.buttonOrDate = (
          <StripeSubscriptionCheckoutSessionButton
            buttonClassName={CTA_BUTTON_CLASSNAME}
            buttonText='Renew subscription'
            cancelPath='subscriptions'
            customerEmail={customerEmail}
            schoolIds={schoolIds}
            stripePriceId={renewalStripePriceId}
            userIsEligibleForNewSubscription={true}
            userIsSignedIn={true}
          />
        )
      }
      break;
    case DISTRICT_PREMIUM:
      content.premiumCopy = schoolPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact);
      image = 'school_premium_icon.png';
      content.status = <h2>You have a {subscriptionType} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      content.boxColor = '#9c2bde';
      if (remainingDays < 0) {
        content.buttonOrDate = (
          <a
            className={CTA_BUTTON_CLASSNAME}
            href="/request_renewal"
          >
            Contact us to renew
          </a>
        )
      }
      break;
    case SCHOOL_PREMIUM_SCHOLARSHIP:
      content.premiumCopy = schoolPremiumCopy(subscriptionType, subscriptionStatus, remainingDays, userIsContact);
      image = 'school_premium_icon.png';
      content.status = <h2>You have a {SCHOOL_PREMIUM} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      content.boxColor = '#9c2bde';
      if (remainingDays < 0) {
        content.buttonOrDate = <a className={CTA_BUTTON_CLASSNAME} href="/premium">Subscribe to premium</a>
      }
      break;
  }

  if (remainingDays < 0) {
    content.boxColor = '#ff4542'
    content.status = <h2><i className="fas fa-exclamation-triangle" />{`Your ${subscriptionType} subscription has expired`}</h2>
  }

  return (
    <section className="subscription-status">
      <div className="flex-row space-between">
        <div className="box-and-h2 flex-row space-between">
          <div className="box" style={{ backgroundColor: content.boxColor, }} />
          {content.status}
        </div>
        {content.buttonOrDate}
      </div>
      <p>{content.premiumCopy}</p>
    </section>
  );
}

export default SubscriptionStatus
