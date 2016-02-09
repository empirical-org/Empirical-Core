EC.NewSignUpBanner = React.createClass({

  render: function() {
    return (
      <div className='row new-sign-up-banner'>
        <div className='col-md-9 col-xs-12 pull-left'>
          <h4>Success! You started your 30 day trial</h4>
          <span>Now let’s save time grading and gain actionable insights.</span>
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <button type='button' className='button-green'>Check out Your Premium Student Results</button>
          </div>
        </div>
      </div>
    );
  }

});
