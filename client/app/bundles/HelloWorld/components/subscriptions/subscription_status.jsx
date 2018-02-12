import React from 'react';
import moment from 'moment';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscriptionType: this.subscriptionType(),
      userIsContact: this.userIsContact(), };
  }

  userIsContact() {
    return Number(document.getElementById('current-user-id').getAttribute('content')) === this.props.subscriptionStatus.contact_user_id;
  }

  subscriptionType() {
    const accountType = this.props.subscriptionStatus.account_type;
    if (this.props.schoolSubscriptionTypes.includes(accountType)) {
      return 'School';
    } else if (this.props.trialSubscriptionTypes.includes(accountType)) {
      return 'Trial';
    }
    return 'Teacher';
  }

  status() {
    if (!this.props.subscriptionStatus) {
      return "You don't have a subscription";
    }
    const subscriptionType = this.state.subscriptionType;
    if (this.props.subscriptionStatus.expired) {
      return `Your ${subscriptionType} Premium subscription has expired`;
    }
    return `You have a ${subscriptionType} Premium subscription`;
  }

  buttonOrDate() {
    let buttonOrDate;
    if (this.props.subscriptionStatus) {
      if (!this.props.subscriptionStatus.expired) {
        buttonOrDate = (
          <span className="expiration-date">
            <span>Valid Until:</span> {moment(this.props.subscriptionStatus.expiration).format('MMMM Do, YYYY')} (EST)
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
      buttonOrDate = <button>Buy Teacher Premium Now</button>;
    }
    return buttonOrDate;
  }

  getBoxColor() {
    if (this.props.subscriptionStatus.expired) {
      return '#ff4542';
    } else if (this.state.subscriptionType === 'School') {
      return '#9c2bde';
    }
    return '#348fdf';
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
