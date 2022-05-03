import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

import StripeSubscriptionCheckoutSessionButton from '../shared/StripeSubscriptionCheckoutSessionButton';

import {
  TEACHER_PREMIUM_TRIAL,
  TEACHER_PREMIUM_CREDIT,
  TEACHER_PREMIUM_SCHOLARSHIP,
  TEACHER_PREMIUM,
  SCHOOL_PREMIUM,
  SCHOOL_PREMIUM_SCHOLARSHIP,
  DISTRICT_PREMIUM
} from './constants';

const quillBasicCopy = (
  <span>
    Quill Basic provides access to all of Quill&apos;s content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription.
  </span>);

function schoolPremiumCopy(subscriptionType) {
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

function teacherPremiumCopy(subscriptionType) {
  return (
    <span>
      With {subscriptionType}, you will have access to all of Quill’s free reports as well as additional advanced reporting.
      You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis.
      <a className="green-link" href="https://support.quill.org/quill-premium"> Here’s more information</a> about your {subscriptionType} features.
    </span>
  )
};

const SubscriptionStatus = ({
  subscriptionStatus,
  subscriptionType,
  userIsContact,
}) => {


  const renewalStripePriceId = subscriptionStatus && subscriptionStatus.renewal_stripe_price_id

  const content = {};
  let image
  let expiration
  let remainingDays

  let subscriptionTypeText = subscriptionType;

  if (subscriptionType !== 'Basic') {
    expiration = moment(subscriptionStatus.expiration);
    remainingDays = expiration.diff(moment(), 'days');
  }

  switch (subscriptionType) {
    case 'Basic':
      image = 'basic_icon.png';
      content.premiumCopy = quillBasicCopy;
      content.boxColor = '#00c2a2';
      content.buttonOrDate = <a className="q-button cta-button bg-orange text-white" href="/premium">Learn More About Quill Premium</a>;
      subscriptionTypeText = 'Quill Basic';
      content.status = <h2>{`You have a ${subscriptionType} subscription`}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      break;
    case TEACHER_PREMIUM_TRIAL:
    case TEACHER_PREMIUM_CREDIT:
    case TEACHER_PREMIUM:
    case TEACHER_PREMIUM_SCHOLARSHIP:
      content.premiumCopy = teacherPremiumCopy(subscriptionType);
      image = 'teacher_premium_icon.png';
      const teacherSubDisplayName = subscriptionType === TEACHER_PREMIUM_SCHOLARSHIP ? TEACHER_PREMIUM : subscriptionType
      content.status = <h2>You have a {teacherSubDisplayName} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      if (remainingDays < 0) {
        content.boxColor = '#ff4542';
      } else {
        content.boxColor = '#348fdf';
      }
      break;
    case SCHOOL_PREMIUM:
    case DISTRICT_PREMIUM:
    case SCHOOL_PREMIUM_SCHOLARSHIP:
      content.premiumCopy = schoolPremiumCopy(subscriptionType);
      const schoolSubDisplayName = subscriptionType === SCHOOL_PREMIUM_SCHOLARSHIP ? SCHOOL_PREMIUM : subscriptionType
      content.status = <h2>You have a {schoolSubDisplayName} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      content.boxColor = '#9c2bde';
      image = 'school_premium_icon.png';
      if (remainingDays < 90 && !subscriptionStatus.recurring) {
        if (userIsContact) {
          content.buttonOrDate = <button className="q-button bg-orange text-white cta-button" onClick={showPurchaseModal} type="button">Renew School Premium</button>;
        } else {
          content.buttonOrDate = <button type="button">Contact {subscriptionStatus.contact_name} to Renew</button>;
        }
      }
      break;
  }

  if (remainingDays < 0) {
    const dateFormat = "MM/DD/YY"
    const formattedStartDate = subscriptionStatus && moment(subscriptionStatus.start_date).format(dateFormat)
    const formattedExpirationDate = expiration && expiration.format(dateFormat)
    content.boxColor = '#ff4542';
    content.status = <h2><i className="fas fa-exclamation-triangle" />{`Your ${subscriptionType} subscription has expired`}</h2>;
    content.premiumCopy = (
      <span>
        <strong>Your {subscriptionType} subscription ({formattedStartDate} - {formattedExpirationDate}) has expired and you are back to Quill Basic.</strong>
        {quillBasicCopy}
      </span>);

    content.buttonOrDate = (
      <StripeSubscriptionCheckoutSessionButton
        buttonClassName="renew-subscription q-button bg-orange text-white cta-button"
        buttonText='Renew Subscription'
        cancelPath='subscriptions'
        customerEmail={subscriptionStatus.customer_email}
        stripePriceId={renewalStripePriceId}
        userIsEligibleForNewSubscription={true}
        userIsSignedIn={true}
      />
    )
  }

  content.buttonOrDate = content.buttonOrDate || (<span className="expiration-date">
    <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
  </span>)
  content.status = content.status || <h2>{`You have a ${subscriptionTypeText} subscription`}<img alt={`${subscriptionTypeText}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;

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
