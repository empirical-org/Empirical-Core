import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscriptionType: this.subscriptionType(),
      userIsContact: this.userIsContact(), };
  }

  userIsContact() {
    if (this.props.subscriptionStatus) {
      return Number(document.getElementById('current-user-id').getAttribute('content')) === this.props.subscriptionStatus.contact_user_id;
    }
    return false;
  }

  subscriptionType() {
    if (!this.props.subscriptionStatus) {
      return 'Basic';
    }
    const accountType = this.props.subscriptionStatus.account_type;
    if (this.props.schoolSubscriptionTypes.includes(accountType)) {
      return 'School';
    } else if (this.props.trialSubscriptionTypes.includes(accountType)) {
      return 'Trial';
    }
    return 'Teacher';
  }

  status() {
    let image;
    const subscriptionType = this.state.subscriptionType;
    if (this.state.subscriptionType === 'Basic') {
      image = 'shared/basic_icon.png';
      return <span>{`You have a Quill ${subscriptionType} Subscription`}<img src={`https://assets.quill.org/images/${image}`} alt={`${subscriptionType}`} /></span>;
    } else if (this.props.subscriptionStatus.expired) {
      return `Your ${subscriptionType} Premium subscription has expired`;
    } else if (this.state.subscriptionType === 'Teacher') {
      image = 'shared/teacher_premium_icon.png';
      return <span>{`You have a ${subscriptionType} Premium subscription`}<img src={`https://assets.quill.org/images/${image}`} alt={`${subscriptionType}`} /></span>;
    }
  }

  buttonOrDate() {
    let buttonOrDate;
    if (this.props.subscriptionStatus) {
      const expiration = moment(this.props.subscriptionStatus.expiration);
      const remainingDays = expiration.diff(moment(), 'days');
      if (!this.props.subscriptionStatus.expired) {
        buttonOrDate = (
          <span className="expiration-date">
            <span>Valid Until:</span> <span>{`${expiration.format('MMMM Do, YYYY')}`}</span><span className="time-left-in-days"> | {`${remainingDays} ${pluralize('days', remainingDays)}`}</span>
          </span>
          );
      } else if (this.state.subscriptionType === 'School') {
        if (this.state.userIsContact) {
          buttonOrDate = <button>Renew School Premium</button>;
        } else {
          buttonOrDate = <button>Contact {this.props.subscriptionStatus.contact_name} to Renew</button>;
        }
      } else {
        buttonOrDate = <button>Renew Premium</button>;
      }
    } else {
      buttonOrDate = <a href="/premium" className="q-button cta-button bg-orange text-white">Learn More About Quill Premium</a>;
    }
    return buttonOrDate;
  }

  getBoxColor() {
    if (this.state.subscriptionType === 'Basic') {
      return '#00c2a2';
    } else if (this.props.subscriptionStatus.expired) {
      return '#ff4542';
    } else if (this.state.subscriptionType === 'School') {
      return '#9c2bde';
    }
  }

  render() {
    return (
      <section className="subscription-status">
        <div className="flex-row space-between">
          <div className="box-and-h2 flex-row space-between">
            <div className="box" style={{ backgroundColor: this.getBoxColor(), }} />
            <h2>{this.status()}</h2>
          </div>
          {this.buttonOrDate()}
        </div>
        <p>
          With Quill School Premium, you will have access to all of Quill’s
          free reports as well as additional advanced reporting. You will also
          be able to view and print reports of your students’ progress. Our
          advanced reports support concept, Common Core, and overall progress
          analysis. <a className="green-link">Here’s more information</a> about your Teacher Premium features.
        </p>
      </section>
    );
  }
}
