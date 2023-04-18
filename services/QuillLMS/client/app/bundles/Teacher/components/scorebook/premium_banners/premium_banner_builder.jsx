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

  hasPremium = () => {
    const { has_premium, first_day_of_premium_or_trial, } = this.state
    let color = this.stateSpecificBackGroundColor();
    let divStyle = {
      backgroundColor: color
    };
    if ((has_premium === null) || (has_premium === 'school') || ((has_premium === 'paid') && (first_day_of_premium_or_trial === false))) {
      return (<span />);
    } else
    {
      return (
        <div>
          <div id='premium-banner' style={divStyle}>
            <div className='container'>
              {this.stateSpecificComponents()}
            </div>
          </div>
          <div className='row school-premium-banner'>
            <div className='container'>
              <span>
                <div className='row'>
                  <div className='col-md-9 col-xs-12 pull-left'>
                    <h4>Representing a School or District?</h4>
                    <span>Starting April 1st, when you purchase School or District Premium, you&apos;ll receive Quill Premium for free for the remainder of the school year!</span>
                  </div>
                  <div className='col-md-3 col-xs-12 pull-right'>
                    <div className='premium-button-box text-center'>
                      <a href='/premium/request-school-quote'><button className='btn-orange' type='button'>Get in touch!</button></a>
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    return (this.hasPremium());

  }
}
