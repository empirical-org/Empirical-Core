'use strict'

 import React from 'react'

 export default  React.createClass({

    beginTrial: function() {
      $.post('/subscriptions', {account_limit: 1000, account_type: 'trial'})
      .success(function(){window.location.assign('/teachers/classrooms/scorebook');});
    },

  miniBuilder: function() {
    return (
      <div className='premium-container '>
        <h4>Try Premium for Free</h4>
        <button type='button' className='btn btn-orange' onClick={this.beginTrial}>Get Premium Free for 30 days</button>
        <p className='credit-card'>No credit card required.</p>
        <p>Unlock your Premium trial to save time grading and gain actionable insights.</p>
        <a href='/premium'>Learn more about Premium ></a>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container results-overview-mini-container col-md-4 col-sm-5 text-center"}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>);
}
});
