'use strict';
import React from 'react'
import GoogleSignUp from './google_sign_up'
import CleverSignUp from './clever_sign_up'

export default React.createClass({
  render: function () {
    return (
      <div className='text-center auth-section'>
        <GoogleSignUp clickAnalyticsEvent={this.props.clickGoogleAnalyticsEvent} />
        <CleverSignUp clickAnalyticsEvent={this.props.clickCleverAnalyticsEvent} />
      </div>
    );
  }
});
