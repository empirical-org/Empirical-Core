import React from 'react';
import $ from 'jquery';
import NewSignUpBanner from './new_signup_banner.jsx';

export default React.createClass({

  getInitialState() {
    return { trial_started: false, };
  },

  beginTrial() {
    $.post('/subscriptions', { subscription: { account_type: 'trial', }, })
    .success(this.setState({ trial_started: true, }));
  },

  render() {
    if (this.state.trial_started) {
      return (<NewSignUpBanner status={'trial'} />);
    }
    return (
      <div className="row free-trial-promo">
        <div className="col-md-9 col-xs-12 pull-left">
          <h4>Try Premium for Free</h4>
          <span>Unlock your Premium trial to save time grading and gain actionable insights.</span>
          <br />
          <a href="/premium">Learn more about Premium</a>
        </div>
        <div className="col-md-3 col-xs-12 pull-right">
          <div className="premium-button-box text-center">
            <button type="button" onClick={this.beginTrial} className="btn-orange">Try it Free for 30 Days</button>
            <br />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    );
  },

});
