import React from 'react';
import { requestPost } from '../../../../../modules/request/index';
import NewSignUpBanner from './new_signup_banner.jsx';


export default class FreeTrialBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = { trialStarted: false, };
  }

  beginTrial = () => {
    requestPost('/subscriptions', { subscription: { account_type: 'Teacher Trial', }, }, () => {
      this.setState({ trialStarted: true, })
    })
  }

  render() {
    const { trialStarted, } = this.state

    if (trialStarted) {
      return (<NewSignUpBanner status="trial" />);
    }
    return (
      <div className="row free-trial-promo">
        <div className="col-md-9 col-xs-12 pull-left">
          <h4>Try Premium for Free</h4>
          <span>Unlock your Premium trial to save time grading and gain actionable insights.</span>
          <br />
          <a href="/premium">Learn more about Premium</a>
        </div>
        <div className="col-md-3 col-xs-12 pull-right">
          <div className="premium-button-box text-center">
            <button className="btn-orange" onClick={this.beginTrial} type="button">Try it Free for 30 Days</button>
            <br />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    );
  }
}
