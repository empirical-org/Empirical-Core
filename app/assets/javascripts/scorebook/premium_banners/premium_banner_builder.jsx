EC.PremiumBannerBuilder = React.createClass({

  stateSpecificComponents: function() {
    if (this.props.state === null){
      return <EC.LoadingIndicator/>;
    }
    else if (this.props.state == 'none'){
      return(<EC.FreeTrialBanner/>);
    }
    else if (this.props.daysLeft == 30){
      return(<EC.NewSignUpBanner/>);
    }
    else if ((this.props.state == 'trial') || (this.props.state == 'locked')){
      return(<EC.FreeTrialStatus status={this.props.state} data={this.props.daysLeft}/>);
    }
  },

  stateSpecificBackGroundColor: function() {
    if (this.props.daysLeft == 30){
      return('#d0ffc6');
    } else {
      return('#ffe7c0');
    }
  },

  stateSpecificBackGroundImage: function() {
    if (this.props.daysLeft == 30){
      return('none');
    } else {
      return('url(/images/star_pattern_5.png)');
    }
  },

  hasPremium: function() {
  if ((this.props.state === 'school') || (this.props.state === 'paid')) {
    return (<span/>);
  } else {
    var color = this.stateSpecificBackGroundColor();
    var img = this.stateSpecificBackGroundImage();
    var divStyle = {
      backgroundColor: color,
      backgroundImage: img
    };
    return (
      <div id='premium-banner' style={divStyle}>
        <div className='container'>
          {this.stateSpecificComponents()}
        </div>
      </div>
    );
  }
},

  render: function() {
    return (this.hasPremium());

  }

});
