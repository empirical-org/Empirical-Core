import $ from 'jquery'
import React from 'react'

import FreeTrialBanner from './free_trial_banner.jsx'
import FreeTrialStatus from './free_trial_status.jsx'
import NewSignUpBanner from './new_signup_banner.jsx'

export default class PremiumBannerBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      has_premium: null,
      trial_days_remaining: null,
      first_day_of_premium_or_trial: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    let that = this;
    $.get('/teachers/classrooms/premium')
      .done(function(data) {
        that.setState({
          last_subscription_was_trial: data.last_subscription_was_trial,
          has_premium: data['hasPremium'],
          trial_days_remaining: data['trial_days_remaining'],
          first_day_of_premium_or_trial: data['first_day_of_premium_or_trial']});});
  };

  stateSpecificComponents = () => {
    const { has_premium, first_day_of_premium_or_trial, trial_days_remaining, last_subscription_was_trial, } = this.state

    const { originPage, upgradeToPremiumNowButton } = this.props
    if (has_premium === 'none'){
      return(<FreeTrialBanner status={has_premium} />);
    }
    else if (first_day_of_premium_or_trial ){
      return(<NewSignUpBanner status={has_premium} />);
    }
    else if ((has_premium === 'trial') || (has_premium === 'locked')){
      return(
        <span>
          <FreeTrialStatus
            data={trial_days_remaining}
            lastSubscriptionWasTrial={last_subscription_was_trial}
            originPage={originPage}
            status={has_premium}
            upgradeToPremiumNowButton={upgradeToPremiumNowButton}
          />
        </span>
      );
    }
    else if ((has_premium === 'school') || ((has_premium === 'paid') && (first_day_of_premium_or_trial === false))) {
      return (<span />);
    }
  };

  stateSpecificBackGroundColor = () => {
    const { daysLeft, } = this.props
    if (daysLeft === 30){
      return('#d0ffc6');
    } else {
      return('#ffe7c0');
    }
  };

  stateSpecificBackGroundImage = () => {
    const { daysLeft, } = this.props
    if (daysLeft === 30){
      return('none');
    } else {
      return('url(/images/star_pattern_5.png)');
    }
  };

  hasPremium = () => {
    const { has_premium, first_day_of_premium_or_trial, } = this.state
    let color = this.stateSpecificBackGroundColor();
    let img = this.stateSpecificBackGroundImage();
    let divStyle = {
      backgroundColor: color,
      backgroundImage: img
    };
    if ((has_premium === null) || (has_premium === 'school') || ((has_premium === 'paid') && (first_day_of_premium_or_trial === false))) {
      return (<span />);
    } else
    {
      return (
        <div id='premium-banner' style={divStyle}>
          <div className='container'>
            {this.stateSpecificComponents()}
          </div>
        </div>
      );
    }
  };

  render() {
    return (this.hasPremium());

  }
}
