import React from 'react';

export default React.createClass({
  propTypes: {
    subscription: React.PropTypes.object,
  },

  renderExpirationDate() {
    if (this.props.subscription.expiration) {
      return `Expires:     ${this.transformDate(this.props.subscription.expiration)}`
    } else {
      return 'No expiration date set.'
    }
  },

  renderAccountLimit() {
    if (this.props.subscriptions.account_limit) {
      return `Accounts:       ${this.props.subscription.account_limit} students`
    } else {
      return 'No account limit set.'
    }
  },

  transformDate(dateString) {
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
    } else {
      return ''
    }
  },

  subscriptionType() {
    return this.props.subscription.subscriptionType;
  },

  subscriptionTypeInUserLanguage() {
    if (['none', 'locked'].includes(this.subscriptionType())) {
      return ('basic');
    }
    return (this.props.subscription.subscriptionType);
  },
  render() {
    let getPremium,
      subscriptionDetails;
    if (['free', 'locked', 'none'].includes(this.subscriptionType())) {
      getPremium = (
        <div className="col-xs-3">
          <a href="/premium" target="_new">
            <button className="get-premium">Get Premium</button>
          </a>
        </div>);
      subscriptionDetails = null;
    } else {
      getPremium = null;
      subscriptionDetails = (
        <span className="gray-text">
          <div className="row">
            <div className="col-xs-2" />
            <div className="col-xs-3">
              {this.renderExpirationDate()}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2" />
            <div className="col-xs-3">
              {this.renderAccountLimit()}
            </div>
          </div>
        </span>
        );
    }
    return (
      <span>
        <div className="row">
          <div className="form-label col-xs-2">
            Status
          </div>
          <div className="col-xs-2">
            <input disabled className="inactive" value={this.subscriptionTypeInUserLanguage()} />
          </div>
          {getPremium}

        </div>
        {subscriptionDetails}
      </span>
    );
  },
});
