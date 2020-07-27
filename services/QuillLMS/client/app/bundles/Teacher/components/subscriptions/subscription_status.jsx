import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

const quillBasicCopy = (
  <span>
    Quill Basic provides access to all of Quill&apos;s content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription.
  </span>);

const schoolPremiumCopy = (
  <span>
    With Quill School Premium, you will have access to all of Quill’s
    free reports as well as additional advanced reporting. You will also
    be able to view and print reports of your students’ progress. Our
    advanced reports support concept, Common Core, and overall progress
    analysis. <a className="green-link" href="https://support.quill.org/quill-premium">Here’s more information</a> about your School Premium features.
  </span>
);

const teacherPremiumCopy = (
  <span>With Quill Teacher Premium, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. <a className="green-link" href="https://support.quill.org/quill-premium">Here’s more information</a> about your Teacher Premium features.</span>
);

export default class extends React.Component {

  getContent() {
    const content = {};
    let image,
      expiration,
      remainingDays;
    let subscriptionType = this.props.subscriptionType;
    if (this.props.subscriptionType !== 'Basic') {
      expiration = moment(this.props.subscriptionStatus.expiration);
      remainingDays = expiration.diff(moment(), 'days');
    }
    switch (this.props.subscriptionType) {
      case 'Basic':
        image = 'basic_icon.png';
        content.pCopy = quillBasicCopy;
        content.boxColor = '#00c2a2';
        content.buttonOrDate = <a className="q-button cta-button bg-orange text-white" href="/premium">Learn More About Quill Premium</a>;
        subscriptionType = 'Quill Basic';
        content.status = <h2>{`You have a ${subscriptionType} subscription`}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
        break;
      case 'Teacher':
        image = 'teacher_premium_icon.png';
        content.pCopy = teacherPremiumCopy;
        if (remainingDays < 0) {
          content.boxColor = '#ff4542';
        } else {
          content.boxColor = '#348fdf';
        }
        break;
      case 'Trial':
        content.pCopy = teacherPremiumCopy;
        image = 'teacher_premium_icon.png';
        content.status = <h2>{'You have a Teacher Premium subscription'}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
        content.boxColor = '#348fdf';
        break;
      case 'School':
        content.pCopy = schoolPremiumCopy;
        content.boxColor = '#9c2bde';
        image = 'school_premium_icon.png';
        if (remainingDays < 90 && !this.props.subscriptionStatus.recurring) {
          if (this.props.userIsContact) {
            content.buttonOrDate = <button className="q-button bg-orange text-white cta-button" onClick={this.props.showPurchaseModal}>Renew School Premium</button>;
          } else {
            content.buttonOrDate = <button>Contact {this.props.subscriptionStatus.contact_name} to Renew</button>;
          }
        }
        break;
    }
    this.handleExpired(content, remainingDays);
    content.buttonOrDate = content.buttonOrDate || (<span className="expiration-date">
      <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
      </span>);
    content.status = content.status || <h2>{`You have a ${subscriptionType} Premium subscription`}<img alt={`${subscriptionType}`} src={`https://assets.quill.org/images/shared/${image}`} /></h2>;
    return content;
  }

  handleExpired(content, remainingDays) {
    if (remainingDays < 1) {
      content.boxColor = '#ff4542';
      content.status = <h2><i className="fas fa-exclamation-triangle" />{`Your ${this.props.subscriptionType} Premium subscription has expired`}</h2>;
      content.pCopy = (
        <span>
          <strong>Your {this.props.subscriptionType} Premium subscription has expired and you are back to Quill Basic.</strong>
          {quillBasicCopy}
        </span>);
      content.buttonOrDate = <button className="renew-subscription q-button bg-orange text-white cta-button" onClick={this.props.showPurchaseModal}>Renew Subscription</button>;
    }
  }

  render() {
    const content = this.getContent();
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
}
