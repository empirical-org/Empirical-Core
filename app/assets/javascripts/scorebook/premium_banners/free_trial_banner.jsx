EC.FreeTrialBanner = React.createClass({

  beginTrial: function() {
    this.startTrial = $.post('/subscriptions', {account_limit: 1000, account_type: 'trial'}, function(result) {
    }.bind(this));
  },

  render: function() {
    return (
      <div className='row free-trial-promo'>
        <div className='col-md-9 col-xs-12 pull-left'>
          <h4>Try Premium for Free</h4>
          <span>Unlock your Premium trial to save time grading and gain actionable insights.</span>
          <br/>
          <a href='/premium'>Learn more about Premium</a>
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <button type='button' onClick={this.beginTrial} className='btn-orange'>Try it Free for 30 Days</button>
            <br/>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    );
  }

});
