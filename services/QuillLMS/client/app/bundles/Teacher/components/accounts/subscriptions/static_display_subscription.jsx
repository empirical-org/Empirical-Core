import React from 'react';

export default class StaticDisplaySubscription extends React.Component {
  renderExpirationDate = () => {
    if (this.props.subscription.expiration) {
      return `Expires: ${this.transformDate(this.props.subscription.expiration)}`;
    }
    return 'No expiration date set.';
  };

  transformDate = (dateString) => {
    if (dateString) {
      let year,
        month,
        day,
        newString;
      year = dateString.slice(0, 4);
      month = dateString.slice(5, 7);
      day = dateString.slice(8, 10);
      newString = `${month}/${day}/${year}`;
      return newString;
    }
    return '';
  };

  subscriptionType = () => {
    return this.props.subscription.subscriptionType;
  };

  subscriptionTypeInUserLanguage = () => {
    if (['none', 'locked'].includes(this.subscriptionType())) {
      return ('basic');
    }
    return (this.props.subscription.subscriptionType);
  };

  render() {
    let getPremium,
      subscriptionDetails;
    if (['free', 'locked', 'none'].includes(this.subscriptionType())) {
      getPremium = (
        <a href="/subscriptions" target="_new">
          <button className="form-button get-premium">Get Premium</button>
        </a>);
      subscriptionDetails = null;
    } else {
      getPremium = null;
      subscriptionDetails = (
        <span className="gray-text">
          <div className="row">
            {this.renderExpirationDate()}
          </div>
        </span>
      );
    }
    return (
      <span>
        <div className="form-row">
          <div className="form-label">
            Status
          </div>
          <div className="form-input">
            <input className="inactive" disabled value={this.subscriptionTypeInUserLanguage()} />
          </div>
          {getPremium}

        </div>
        {subscriptionDetails}
      </span>
    );
  }
}
