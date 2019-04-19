import React from 'react';
import { PropTypes } from 'react-metrics';

export default React.createClass({
  contextTypes: {
    metrics: PropTypes.metrics
  },

  render: function() {
    return (
      <a className="google-sign-up" href="/auth/google_oauth2?prompt=consent"
         onClick={(e) => this.context.metrics.track(this.props.clickAnalyticsEvent)}>
        <img src="/images/google_icon.svg" alt="google icon"  />
        <span>Sign up with Google</span>
      </a>
    );
  }
});
