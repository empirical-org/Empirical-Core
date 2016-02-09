EC.PremiumBannerBuilder = React.createClass({

  stateSpecificComponents: function() {
    if (this.props.state === null){
      return <EC.LoadingIndicator/>;
    }
    else if (this.props.state == 'none'){
        return(<EC.FreeTrialBanner/>);
    }
    else if (this.props.state == 'trial'){
        return(<EC.FreeTrialCountDown/>);
    }
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
