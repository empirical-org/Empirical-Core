import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import UpdateStripeCard from '../modules/stripe/update_card.js';
import getAuthToken from '../modules/get_auth_token';
import LoadingIndicator from '../shared/loading_indicator.jsx';
import ChangePlan from './change_plan';
import TitleAndContent from './current_subscription_title_and_content';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showChangePlan: false,
      lastFour: this.props.lastFour,
    };
    this.toggleChangePlan = this.toggleChangePlan.bind(this);
    this.updateRecurring = this.updateRecurring.bind(this);
    this.editCreditCard = this.editCreditCard.bind(this);
    this.updateLastFour = this.updateLastFour.bind(this);
  }

  getPaymentMethod() {
    let content;
    if (!this.state.lastFour && ['Teacher', 'School'].includes(this.props.subscriptionType)) {
      return <span>School Invoice</span>;
    }
    return (<span>{`Credit Card Ending In ${this.state.lastFour}`}
      <span
        onClick={this.editCreditCard} style={{
          color: '#027360',
          fontSize: '14px',
          paddingLeft: '10px',
          cursor: 'pointer',
        }}
      >Edit Credit Card</span>
    </span>);
  }

  editCreditCard() {
    new UpdateStripeCard(this.updateLastFour);
  }

  updateLastFour(newLastFour) {
    this.setState({ lastFour: newLastFour, });
  }

  toggleChangePlan() {
    this.setState({
      showChangePlan: !this.state.showChangePlan,
    });
  }

  updateRecurring(recurring) {
    this.props.updateSubscription({
      recurring,
    }, _.get(this.props.subscriptionStatus, 'id'));
  }

  changePlan() {
    if (this.state.showChangePlan) {
      return (<ChangePlan recurring={_.get(this.props.subscriptionStatus, 'recurring')} updateRecurring={this.updateRecurring} />);
    }
  }

  paymentMethod() {
    return (
      <div className="meta-section payment">
        <h3>PAYMENT METHOD ON FILE</h3>
        {this.getPaymentMethod()}
      </div>
    );
  }

  nextPlanAlert(body) {
    return <div className="next-plan-alert flex-row vertically-centered"><i className="fa fa-icon fa-lightbulb-o" />{body}</div>;
  }

  changePlanInline() {
    return (
      <span>
        <span className="green-link" onClick={this.toggleChangePlan}>Change Plan</span>
        {this.changePlan()}
      </span>
    );
  }

  nextPlanContent() {
    let nextPlan;
    let beginsOn;
    let nextPlanAlertContent;
    if (!this.props.subscriptionStatus) {
      const content = (<span>N/A
                        <a href="/premium" className="green-link">Change Plan</a>
      </span>);
      return (<TitleAndContent title={'Next Plan'} content={content} />);
    } else if (this.props.subscriptionStatus.expired) {
      return (<div>
        <button onClick={this.props.showPaymentModal} className="renew-subscription q-button bg-orange text-white cta-button">Renew Subscription</button>
      </div>);
    } else if (this.props.subscriptionStatus.account_type === 'Premium Credit') {
      const content = (<span>Quill Basic - Free
                    <a href="/premium" className="green-link">Change Plan</a>
      </span>);
      return (<TitleAndContent title={'Next Plan'} content={content} />);
    } else if (this.props.subscriptionStatus.recurring) {
      nextPlan = (<span>
                    Teacher Premium - $80 Annual Subscription {this.changePlanInline()}
      </span>);
      const renewDate = moment(this.props.subscriptionStatus.expiration).add('days', 1).format('MMMM Do, YYYY');
      nextPlanAlertContent = this.nextPlanAlert(`Your Subscription will be renewed on ${renewDate} and your card ending in ${this.state.lastFour} will be charged $80.`);
      beginsOn = (
        <TitleAndContent title={'Begins On'} content={renewDate} />
      );
    } else {
      nextPlanAlertContent = this.nextPlanAlert('Once your current Teacher Premium subscription expires, you will be downgraded to the Quill Basic subscription.');
      nextPlan = <span>Quill Basic - Free {this.changePlanInline()}</span>;
    }
    return (
      <div>
        <div className="flex-row space-between">
          <TitleAndContent title={'Next Plan'} content={<span>{nextPlan}</span>} />
          {beginsOn}
        </div>
        {nextPlanAlertContent}
      </div>
    );
  }

  nextPlan() {
    return (
      <div className="meta-section">
        <h3>NEXT SUBSCRIPTION</h3>
        {this.nextPlanContent()}
      </div>
    );
  }

  content() {
    const currSub = this.props.subscriptionStatus;
    const metaRowClassName = 'sub-meta-info';
    const buttonRowClassName = 'sub-button-row';
    if (currSub) {
      return ({ metaRows: (
        <div className={metaRowClassName}>
          <div className="meta-section">
            <h3>CURRENT SUBSCRIPTION</h3>
            <div className="flex-row space-between">
              <div>
                <TitleAndContent title={'Plan'} content={currSub.account_type} />
                <TitleAndContent title={'Purchaser'} content={this.props.purchaserNameOrEmail} />
              </div>
              <div>
                <TitleAndContent title={'Start Date'} content={moment(currSub.start_date).format('MMMM Do, YYYY')} />
                <TitleAndContent title={'End Date'} content={moment(currSub.expiration).format('MMMM Do, YYYY')} />
              </div>
            </div>
          </div>
          {this.paymentMethod()}
          {this.nextPlan()}
        </div>
      ),
        cta: (<span />), });
    }
  // set a more basic state if we don't have the info
    return ({ metaRows: (
      <div className={metaRowClassName}>
        <div className="meta-section">
          <h3>CURRENT SUBSCRIPTION</h3>
          <TitleAndContent title={'Plan'} content={'Quill Basic Subscription'} />
        </div>
        {this.paymentMethod()}
        {this.nextPlan()}
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
