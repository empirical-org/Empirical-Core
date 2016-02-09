EC.FreeTrialStatus = React.createClass({

  stateSpecificComponents:function() {
    if (this.props.status == 'trial') {
      return(
        <div>
            <h4>You have {this.props.data} days left in your trial.</h4>
              <span>Getting value out of Premium? Check out our pricing plans.</span>
      </div>
    );} else if (this.props.status == 'locked') {
      return(<div>
        <h4>Your Premium Trial Has Expired</h4>
          <span>To continue using Premium check out our pricing plans.</span>
      </div>);
    }
  },


  render: function() {
    return (
      <div className='row'>
        <div className='col-md-9 col-xs-12 pull-left'>
          {this.stateSpecificComponents()}
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <a href='/premium'><button type='button' className='btn-orange'>Upgrade to Premium Now</button></a>
          </div>
        </div>
      </div>
    );
  }

});
