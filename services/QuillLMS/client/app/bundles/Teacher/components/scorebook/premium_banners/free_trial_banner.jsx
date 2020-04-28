import React from 'react';
import NewSignUpBanner from './new_signup_banner.jsx';
import { requestPost } from '../../../../../modules/request/index.js';


export default class FreeTrialBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = { trialStarted: false, };
  }

  // beginTrial = () => {
  //   requestPost('/subscriptions', { subscription: { account_type: 'Teacher Trial', }, }, () => {
  //     this.setState({ trialStarted: true, })
  //   })
  // }

  handleActivateSubscription = () => {
    window.location.href = '/subscriptions/activate_covid_subscription'
  }

  render() {
    if (this.state.trialStarted) {
      return (<NewSignUpBanner status={'trial'} />);
    }
    return (
      <div className="row free-trial-promo">
        <div className="col-md-9 col-xs-12 pull-left">
          <h4>Activate free Quill Premium</h4>
          <span>You can activate Quill Premium through the end of the 2019/2020 school year.</span>
          <br />
          <a href="/premium">Learn more about Premium</a>
        </div>
        <div className="col-md-3 col-xs-12 pull-right">
          <div className="premium-button-box text-center">
            <button className="btn-orange" onClick={this.handleActivateSubscription} type="button">Get Premium Free</button>
            <br />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    );
  }
}
