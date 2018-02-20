import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import UpdateStripeCard from '../modules/stripe/update_card.js';
import getAuthToken from '../modules/get_auth_token';
import LoadingIndicator from '../shared/loading_indicator.jsx';
import ChangePlan from './change_plan';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showChangePlan: false,
    };
    this.toggleChangePlan = this.toggleChangePlan.bind(this);
    this.updateRecurring = this.updateRecurring.bind(this);
  }

  getPaymentMethod() {
    if (!this.props.lastFour) {
      return 'No Payment Method On File';
    }
    return `Credit Card Ending In ${this.props.lastFour}`;
  }

  toggleChangePlan() {
    this.setState({ showChangePlan: !this.state.showChangePlan, });
  }

  updateRecurring(recurring) {
    this.props.updateSubscription({ recurring, }, _.get(this.props.subscriptionStatus, 'id'));
  }

  changePlan() {
    if (this.state.showChangePlan) {
      return (<ChangePlan
        recurring={_.get(this.props.subscriptionStatus, 'recurring')}
        updateRecurring={this.updateRecurring}
      />);
    }
  }

  content() {
    const currSub = this.props.subscriptionStatus;
    const metaRowClassName = 'sub-meta-info';
    const buttonRowClassName = 'sub-button-row';
    if (currSub) {
      return ({ metaRows: (
        <div className={metaRowClassName}>
          <div>
            <div>
              <h3>CURRENT SUBSCRIPTION</h3>
              <span className="title">Plan</span>
              <span>{currSub.account_type}</span>
            </div>
            <div>
              <span className="title">Payment Method</span>
              <span>
                {this.getPaymentMethod()}
                <span onClick={this.toggleChangePlan}>Change Plan</span>
                {this.changePlan()}
              </span>
            </div>
            <div>
              <span className="title">Renewal Settings</span>
              <span>boop</span>
            </div>
          </div>
          <div>
            <div>
              <span className="title">Purchaser</span>
              <span>{this.props.purchaserNameOrEmail}</span>
            </div>
            <div>
              <span className="title">Valid Until</span>
              <span>{moment(currSub.expirationDate).format('MMMM Do, YYYY')}</span>
            </div>
          </div>
        </div>
        ),
        cta: (
          <div className={buttonRowClassName}>
            <button type="button" id="purchase-btn" data-toggle="modal" onClick={this.updateCard} className="q-button button cta-button bg-orange text-white">Update Card</button>
          </div>
        ), });
    }
    // set a more basic state if we don't have the info
    return ({ metaRows: (
      <div className={metaRowClassName}>
        <div className="meta-section">
          <h3>CURRENT SUBSCRIPTION</h3>
          <span className="title">Plan</span>
          <span>Quill Basic Subscription</span>
        </div>
        <div className="meta-section">
          <h3>PAYMENT METHOD ON FILE</h3>
          <span>{this.getPaymentMethod()}</span>
        </div>
        <div className="meta-section">
          <h3>NEXT SUBSCRIPTION</h3>
          <span className="title">
            Next Plan
          </span>
          <span>N/A <a href="/premum" className="green-link">Change Plan</a></span>
        </div>
      </div>
      ),
      cta: (
        <div className={buttonRowClassName}>
          <a href="/" className="q-button button cta-button bg-orange text-white">Learn More About Quill Premium</a>
          <a href="/" className="q-button button cta-button bg-quillblue text-white">Download Premium PDF</a>
        </div>
      ), });
  }

  render() {
    const content = this.content();
    return (
      <section>
        <h2>Subscription Information</h2>
        <div className="current-subscription-information-and-cta">
          <div className="current-subscription-information">
            {content.metaRows}
          </div>
          {content.cta}
        </div>
      </section>
    );
  }
}
