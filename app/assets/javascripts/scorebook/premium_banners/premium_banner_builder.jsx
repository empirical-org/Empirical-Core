EC.PremiumBannerBuilder = React.createClass({


  getInitialState: function() {
    return {has_premium: null,
            trial_days_remaining: null,
            first_day_of_premium_or_trial: null
    };
  },

  fetchData: function() {
    var that = this;
    $.get('/teachers/classrooms/premium')
    .success(function(data) {
      that.setState({
        has_premium: data['hasPremium'],
        trial_days_remaining: data['trial_days_remaining'],
        first_day_of_premium_or_trial: data['first_day_of_premium_or_trial']});});
  },

  stateSpecificComponents: function() {
    if (this.state.has_premium === null){
      return <EC.LoadingIndicator/>;
    }
    else if (this.state.has_premium == 'none'){
      return(<EC.FreeTrialBanner status={this.state.has_premium}/>);
    }
    else if (this.state.first_day_of_premium_or_trial ){
      return(<EC.NewSignUpBanner status={this.state.has_premium}/>);
    }
    else if ((this.state.has_premium == 'trial') || (this.state.has_premium == 'locked')){
      return(<span>
        <EC.FreeTrialStatus status={this.state.has_premium} data={this.state.trial_days_remaining}/>
        </span>);
    }
    else if ((this.state.has_premium === 'school') || ((this.state.has_premium === 'paid') && (this.state.first_day_of_premium_or_trial === false))) {
        return (<span/>);
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
  },

  componentDidMount: function() {
    this.fetchData();
  },


  render: function() {
    return (this.hasPremium());

  }

});
