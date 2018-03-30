import React from 'react';
import $ from 'jquery';

export default React.createClass({

  beginTrial() {
    $.post('/subscriptions', { subscription: { account_type: 'Teacher Trial', }, })
      .success(() => { window.location.assign('/'); });
  },

  miniBuilder() {
    return (
      <div className="premium-container ">
        <h4>Try Premium for Free</h4>
        <button type="button" className="btn btn-orange" onClick={this.beginTrial}>Get Premium Free for 30 days</button>
        <p className="credit-card">No credit card required.</p>
        <p>Unlock your Premium trial to save time grading and gain actionable insights.</p>
        <a href="https://support.quill.org/quill-premium" target="_blank">Learn more about Premium</a>
      </div>
    );
  },

  render() {
    return (
      <div className={'mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>);
  },
});
