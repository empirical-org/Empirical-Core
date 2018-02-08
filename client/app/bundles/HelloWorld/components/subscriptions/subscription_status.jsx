import React from 'react';
import moment from 'moment';

export default class extends React.Component {

  constructor(props) {
    super();
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
    const subscriptionType = this.subscriptionType();
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
          <span>
              Valid Until: {moment(this.props.subscriptionStatus.expiration).format('MMMM Do, YYYY')} (EST)
          </span>
          );
      } else {
        buttonOrDate = <button>Renew Premium</button>;
      }
    }
    buttonOrDate = <button>Buy Teacher Premium Now</button>;
    return buttonOrDate;
  }

  render() {
    return (
      <section>
        <div className="flex-row space-between">
          <h2>{this.status()}</h2>
          {this.buttonOrDate()}
        </div>
        <p>
          With Quill School Premium, you will have access to all of Quill’s
          free reports as well as additional advanced reporting. You will also
          be able to view and print reports of your students’ progress. Our
          advanced reports support concept, Common Core, and overall progress
          analysis.
          <a>Here’s more information</a>
          about your Teacher Premium features.
        </p>
      </section>
    );
  }
}
