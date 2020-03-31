import React from 'react';
import { requestPost } from '../../../../modules/request/index.js';

export default class PremiumMini extends React.Component {

  handleBeginTrialClick() {
    requestPost('/subscriptions', { subscription: { account_type: 'Teacher Trial', }, }, () => {
      window.location.assign('/teachers/progress_reports/activities_scores_by_classroom')
    })
  }

  miniBuilder() {
    /* eslint-disable react/jsx-no-target-blank */
    const supportLink = <a href="/subscriptions/activate_covid_subscription" target="_blank">Learn more about Premium</a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="premium-container ">
        <h4>Activate free Quill Premium</h4>
        <button className="btn btn-orange" onClick={this.handleBeginTrialClick} type="button">Get Premium Free until 7/31/2020</button>
        <p className="credit-card">No credit card required.</p>
        <p>Due to school closures, we're offering Quill Premium free for the rest of the school year.</p>
        {supportLink}
      </div>
    );
  }

  render() {
    return (
      <div className='mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>
    )
  }
}
