'use strict';

import React from 'react';

export default React.createClass({
  propTypes: {
    subscription: React.PropTypes.object.isRequired,
    subscriptionType: React.PropTypes.string.isRequired
  },
  transformDate: function (string) {
    var year, month, day, newString;
    year = string.slice(0,4);
    month = string.slice(5,7);
    day = string.slice(8,10);
    newString = month + "/" + day + "/" + year;
    return newString;
  },

  subscriptionTypeInUserLanguage: function(){
    if (this.props.subscriptionType === 'none' || 'locked') {
      return ('basic');
    } else {
      return (this.props.subscriptionType);
    }
  },
  render: function () {
    var getPremium, subscriptionDetails;
    if (this.props.subscriptionType == 'free' || 'locked' || 'none') {
      getPremium = (
        <div className='col-xs-3'>
          <a href="http://quill.org/premium" target="_new">
            <button className='get-premium'>Get Premium</button>
          </a>
        </div>);
      subscriptionDetails = null;
    } else {
      getPremium = null;
      subscriptionDetails = (
        <span className='gray-text'>
          <div className='row'>
            <div className='col-xs-2'></div>
            <div className='col-xs-3'>
              {"Expires:     " + this.transformDate(this.props.subscription.expiration)}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-2'></div>
            <div className='col-xs-3'>
              {"Accounts:       " + this.props.subscription.account_limit + " students"}
            </div>
          </div>
        </span>
        );
    }
    return (
      <span>
        <div className='row'>
          <div className='form-label col-xs-2'>
            Status
          </div>
          <div className='col-xs-2'>
            <input disabled className='inactive' value={this.subscriptionTypeInUserLanguage()}/>
          </div>
          {getPremium}

        </div>
        {subscriptionDetails}
      </span>
    );
  }
});
