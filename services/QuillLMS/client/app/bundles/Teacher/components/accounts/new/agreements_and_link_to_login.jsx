import React from 'react'
import { PropTypes } from 'react-metrics'

export default React.createClass({
  contextTypes: {
    metrics: PropTypes.metrics
  },

  render: function() {
    return (
      <div className="agreements-and-link-to-login">
        <p className="return-to-login">Already have an account?
          <a href="/session/new"
             onClick={(e) => this.context.metrics.track(this.props.clickLoginAnalyticsEvent)}>Log in</a>
        </p>
        <p className="agreements">By signing up, you agree to our <a href="/tos">Terms of Service</a> and <a href="/privacy">Privacy&nbsp;Policy.</a></p>
      </div>
    );
  }
})
