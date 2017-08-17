import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import DropdownDateSelector from '../../general_components/dropdown_date_selector.jsx';

export default React.createClass({
  propTypes: {
    subscription: React.PropTypes.object,
    updateSubscriptionState: React.PropTypes.func.isRequired,
    updateSubscriptionType: React.PropTypes.func.isRequired,
  },
  updateSubscriptionType() {
    const value = $(this.refs.select).val();
    this.props.updateSubscriptionType(value);
  },

  updateExpiration(newDate) {
    //  YYYY-MM-DD
    let subscription;
    subscription = this.props.subscription;
    subscription.expiration = newDate;
    this.props.updateSubscriptionState(subscription);
  },
  updateSubscriptionAccountLimit() {
    let value,
      subscription;
    value = $(this.refs.accountLimit).val();
    subscription = this.props.subscription;
    subscription.account_limit = value;
    this.props.updateSubscriptionState(subscription);
  },
  getErrors(type) {
    if (this.props.subscription.errors != null) {
      return this.props.subscription.errors[type];
    }
    return null;
  },
  render() {
    const optionStrings = ['none', 'paid', 'trial', 'free low-income', 'free contributor', 'missing school'];
    const options = _.map(optionStrings, optionString => <option key={optionString} value={optionString}>{optionString}</option>);
    return (
      <span>
        <div className="row">
          <div className="col-xs-2 form-label">
            Status
          </div>
          <div className="col-xs-4">
            <select ref="select" onChange={this.updateSubscriptionType} value={this.props.subscription.account_type}>
              {options}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2 form-label">
            Expiration
          </div>

          <DropdownDateSelector date={this.props.subscription.expiration} updateDate={this.updateExpiration} />

        </div>
        <div className="row">
          <div className="col-xs-2 form-label">
            Account Limit
          </div>
          <div className="col-xs-4">
            <input ref="accountLimit" value={this.props.subscription.account_limit} onChange={this.updateSubscriptionAccountLimit} />
          </div>
          <div className="col-xs-2 error">
            {this.getErrors('account_limit')}
          </div>
        </div>
      </span>
    );
  },
});
