EC.PremiumBanner = React.createClass({

  stateSpecificComponents: function() {
    return (
      <div className='row'>
        <div className='col-md-9 col-xs-12 pull-left'>
          <h4>Try Premium for Free</h4>
          <span>Unlock your Premium trial to save time grading and gain actionable insights.</span>
          <br/>
          <a href='/premium'>Learn more about Premium</a>
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <button type='button' className='btn-orange'>Try it Free for 30 Days</button>
            <br/>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div id='premium-banner'>
        <div className='container'>
          {this.stateSpecificComponents()}
        </div>
      </div>
    );
  }

});
