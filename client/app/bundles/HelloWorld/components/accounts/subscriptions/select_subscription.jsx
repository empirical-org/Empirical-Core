'use strict';
'use strict';

import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

export default React.createClass({
  propTypes: {
    subscription: React.PropTypes.object.isRequired,
    updateSubscriptionState: React.PropTypes.func.isRequired,
    subscriptionType: React.PropTypes.string.isRequired,
    updateSubscriptionType: React.PropTypes.func.isRequired
  },
  updateSubscriptionType: function () {
    var value = $(this.refs.select.getDOMNode()).val();
    this.props.updateSubscriptionType(value);
  },
  updateExpiration: function (newDate) {
    //  YYYY-MM-DD
    var subscription;
    subscription = this.props.subscription;
    subscription.expiration = newDate;
    this.props.updateSubscriptionState(subscription);
  },
  updateSubscriptionAccountLimit: function () {
    var value, subscription;
    value = $(this.refs.accountLimit.getDOMNode()).val();
    subscription = this.props.subscription;
    subscription.account_limit = value;
    this.props.updateSubscriptionState(subscription);
  },
  getErrors: function (type) {
    if (this.props.subscription.errors != null) {
      return this.props.subscription.errors[type]
    } else {
      return null;
    }
  },
  render: function () {
    var optionStrings = ['none', 'paid', 'trial'];
    var options = _.map(optionStrings, function (optionString) {
      return <option key={optionString} value={optionString}>{optionString}</option>;
    });
    return (
      <span>
        <div className='row'>
          <div className='col-xs-2 form-label'>
            Status
          </div>
          <div className='col-xs-4'>
            <select ref='select' onChange={this.updateSubscriptionType} value={this.props.subscriptionType}>
              {options}
            </select>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-2 form-label'>
            Expiration
          </div>

          <EC.DropdownDateSelector date={this.props.subscription.expiration} updateDate={this.updateExpiration}/>

        </div>
        <div className='row'>
          <div className='col-xs-2 form-label'>
            Account Limit
          </div>
          <div className='col-xs-4'>
            <input ref='accountLimit' value={this.props.subscription.account_limit} onChange={this.updateSubscriptionAccountLimit}/>
          </div>
          <div className='col-xs-2 error'>
            {this.getErrors('account_limit')}
          </div>
        </div>
      </span>
    );
  }
});
