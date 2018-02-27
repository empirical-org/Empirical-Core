import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

const quillBasicCopy = (
  <p>
    Quill Basic provides access to all of Quill's content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription. Teachers can earn free credits for Teacher Premium by sharing Quill and creating content. <a className="green-link" href="">How to earn Quill Credits.</a>
  </p>);

const schoolPremiumCopy = (
  <p>
    With Quill School Premium, you will have access to all of Quill’s
    free reports as well as additional advanced reporting. You will also
    be able to view and print reports of your students’ progress. Our
    advanced reports support concept, Common Core, and overall progress
    analysis. <a className="green-link">Here’s more information</a> about your Teacher Premium features.
  </p>
);

export default class extends React.Component {

  handleExpired(content, remainingDays) {
    let statusOnClickEvent,
      buttonCopy;
    if (remainingDays < 1) {
      content.boxColor = '#ff4542';
      content.status = <h2><i className="fa fa-exclamation-triangle" />{`Your ${this.props.subscriptionType} Premium subscription has expired`}</h2>;
      if (this.props.subscriptionType === 'School') {
        buttonCopy = 'Renew School Subscription';
        content.pCopy = (
          <p>
            <strong>Your School Premium subscription has expired and you are back to Quill Basic.</strong>
            {quillBasicCopy}
          </p>);
        if (this.props.userIsContact) {
          statusOnClickEvent = this.props.showPurchaseModal;
        } else {
          statusOnClickEvent = () => alert('i will need to be something for when a school user is not the contact');
        }
      } else {
        statusOnClickEvent = this.props.showPurchaseModal;
        content.pCopy = quillBasicCopy;
        buttonCopy = 'Renew Subscription';
      }
      content.buttonOrDate = <button onClick={statusOnClickEvent} className="renew-subscription q-button bg-orange text-white cta-button">{buttonCopy}</button>;
    }
  }

  checkIfExpired() {}

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
        content.buttonOrDate = <a href="/premium" className="q-button cta-button bg-orange text-white">Learn More About Quill Premium</a>;
        subscriptionType = 'Quill Basic';
        break;
      case 'Teacher':
        image = 'teacher_premium_icon.png';
        if (remainingDays < 1) {
          content.boxColor = '#ff4542';
        } else {
          content.boxColor = '#348fdf';
        }
        break;
      case 'Trial':
        image = 'teacher_premium_icon.png';
        break;
      case 'School':
        content.pCopy = schoolPremiumCopy;
        content.boxColor = '#9c2bde';
        image = 'school_premium_icon.png';
        if (remainingDays < 90) {
          if (this.props.userIsContact) {
            content.buttonOrDate = <a href="/premium" className="q-button bg-orange text-white cta-button">Renew School Premium</a>;
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
    content.status = content.status || <h2>{`You have a ${subscriptionType} Premium subscription`}<img src={`https://assets.quill.org/images/shared/${image}`} alt={`${subscriptionType}`} /></h2>;
    return content;
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
        {content.pCopy}
      </section>
    );
  }
}
