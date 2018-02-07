import React from 'react';
import moment from 'moment';

export default class extends React.Component {

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
    const subScriptionType = this.subscriptionType();
    if (this.props.subscriptionStatus.expired) {
      return `Your ${subScriptionType} Premium subscription has expired`;
    }
    return `You have a ${subScriptionType} Premium subscription`;
  }

  render() {
    return (
      <section>
        <div className="flex-row space-between">
          <h2>{this.status()}</h2>
          <span>Valid Until: {moment(this.props.subscriptionStatus.expiration).format('MMMM Do, YYYY')} (EST)</span>
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
