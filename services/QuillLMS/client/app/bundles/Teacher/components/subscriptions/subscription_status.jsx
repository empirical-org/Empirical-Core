import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

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
  return <span>With {subscriptionType}, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. <a className="green-link" href="https://support.quill.org/quill-premium">Here’s more information</a> about your {subscriptionType} features.</span>
};

const SubscriptionStatus = ({ subscriptionType, showPurchaseModal, subscriptionStatus, userIsContact, }) => {
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
      content.pCopy = quillBasicCopy;
      content.boxColor = '#00c2a2';
      content.buttonOrDate = <a className="q-button cta-button bg-orange text-white" href="/premium">Learn More About Quill Premium</a>;
      subscriptionTypeText = 'Quill Basic';
      content.status = <h2>{`You have a ${subscriptionType} subscription`}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      break;
    case 'Teacher Premium Trial':
    case 'Teacher Premium Credit':
    case 'Teacher Premium':
    case 'Teacher Premium (Scholarship)':
      content.pCopy = teacherPremiumCopy(subscriptionType);
      image = 'teacher_premium_icon.png';
      const teacherSubDisplayName = subscriptionType === 'Teacher Premium (Scholarship)' ? 'Teacher Premium' : subscriptionType
      content.status = <h2>You have a {teacherSubDisplayName} subscription<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
      if (remainingDays < 0) {
        content.boxColor = '#ff4542';
      } else {
        content.boxColor = '#348fdf';
      }
      break;
    case 'School Paid':
    case 'District Premium':
    case 'School Premium (Scholarship)':
      content.pCopy = schoolPremiumCopy(subscriptionType);
      const schoolSubDisplayName = subscriptionType === 'School Premium (Scholarship)' ? 'School Premium' : subscriptionType
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

  if (remainingDays < 1) {
    const dateFormat = "MM/DD/YY"

    const formattedStartDate = subscriptionStatus && moment(subscriptionStatus.start_date).format(dateFormat)
    const formattedExpirationDate = expiration && expiration.format(dateFormat)
    content.boxColor = '#ff4542';
    content.status = <h2><i className="fas fa-exclamation-triangle" />{`Your ${subscriptionType} subscription has expired`}</h2>;
    content.pCopy = (
      <span>
        <strong>Your {subscriptionType} subscription ({formattedStartDate} - {formattedExpirationDate}) has expired and you are back to Quill Basic.</strong>
        {quillBasicCopy}
      </span>);
    content.buttonOrDate = <button className="renew-subscription q-button bg-orange text-white cta-button" onClick={showPurchaseModal} type="button">Renew Subscription</button>;
  }

  content.buttonOrDate = content.buttonOrDate || (<span className="expiration-date">
    <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
  </span>);
  content.status = content.status || <h2>{`You have a ${subscriptionTypeText} subscription`}<img alt={`${subscriptionTypeText}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;

  return (
    <section className="subscription-status">
      <div className="flex-row space-between">
        <div className="box-and-h2 flex-row space-between">
          <div className="box" style={{ backgroundColor: content.boxColor, }} />
          <h2>{content.status}</h2>
        </div>
        {content.buttonOrDate}
      </div>
      <p>{content.pCopy}</p>
    </section>
  );
}

export default SubscriptionStatus
