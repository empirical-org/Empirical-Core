import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import EnterOrUpdateStripeCard from '../modules/stripe/enter_or_update_card.js';
import ChangePlan from './change_plan';
import TitleAndContent from './current_subscription_title_and_content';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showChangePlan: false,
      lastFour: this.props.lastFour,
      recurring: _.get(this.props.subscriptionStatus, 'recurring'),
    };
    this.showChangePlan = this.showChangePlan.bind(this);
    this.updateRecurring = this.updateRecurring.bind(this);
    this.editCreditCard = this.editCreditCard.bind(this);
    this.updateLastFour = this.updateLastFour.bind(this);
    this.changeRecurringStatus = this.changeRecurringStatus.bind(this);
  }

  editCreditCardElement() {
    return (
      <span>{`Credit Card Ending In ${this.state.lastFour}`}
        <span
          onClick={this.editCreditCard} style={{
            color: '#027360',
            fontSize: '14px',
            paddingLeft: '10px',
            cursor: 'pointer',
          }}
        >Edit Credit Card</span>
      </span>
    );
  }

  getPaymentMethod() {
    const subStat = this.props.subscriptionStatus;
    if (subStat && subStat.payment_method === 'Credit Card' && this.state.lastFour && this.props.authorityLevel) {
      return this.editCreditCardElement();
    } else if (subStat && subStat.payment_method === 'Credit Card') {
      return <span>Credit Card</span>;
    } else if (this.props.subscriptionType === 'School Sponsored' || this.props.subscriptionType === 'Trial') {
      return <span>No Payment Method on File</span>;
    } else if (subStat && (!subStat.payment_method || subStat.payment_method === 'School Invoice')) {
      return <span>School Invoice</span>;
    } else if (!subStat && this.state.lastFour) {
      return this.editCreditCardElement();
    }
    return <span>No Payment Method on File</span>;
  }

  editCreditCard() {
    new EnterOrUpdateStripeCard(this.updateLastFour, 'Update');
  }

  updateLastFour(newLastFour) {
    this.setState({ lastFour: newLastFour, });
  }

  showChangePlan() {
    this.setState({
      showChangePlan: true,
    });
  }

  updateRecurring(recurring) {
    this.props.updateSubscription(
      { recurring: this.state.recurring, }, _.get(this.props.subscriptionStatus, 'id'));
  }

  changePlan() {
    if (this.state.showChangePlan) {
      return (<ChangePlan subscriptionType={this.props.subscriptionType} price={this.getPrice()} recurring={this.state.recurring} changeRecurringStatus={this.changeRecurringStatus} />);
    }
  }

  changeRecurringStatus(status) {
    this.setState({ recurring: status, });
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
    if (this.props.authorityLevel && this.props.subscriptionStatus.payment_method === 'Credit Card') {
      let onClickEvent = this.showChangePlan;
      let copy = 'Change Plan';
      if (this.state.showChangePlan) {
        onClickEvent = this.updateRecurring;
        copy = 'Save Change';
      }
      return (
        <span key={`change-plan${this.state.showChangePlan}`}>
          <span className="green-link" onClick={onClickEvent}>{copy}</span>
          {this.changePlan()}
        </span>
      );
    }
  }

  lessThan90Days() {
    // <button className="q-button bg-quillblue text-white">Download Quote</button>
    return (
      <div>
        <button onClick={this.props.showPurchaseModal} className="q-button bg-orange text-white">Renew Subscription</button>
      </div>
    );
  }

  renewPremium() {
    return (<div>
      <button onClick={this.props.showPurchaseModal} className="renew-subscription q-button bg-orange text-white cta-button">Renew Subscription</button>
    </div>);
  }

  onceYourPlanExpires() {
    return `Once your current ${this.props.subscriptionType} Premium subscription expires, you will be downgraded to the Quill Basic subscription.`;
  }

  contactSales() {
    return <span>To renew your subscription for next year, contact us now at <a href="mailto:sales@quill.org">sales@quill.org</a>.</span>;
  }

  nextPlanAlertOrButtons(condition, renewDate) {
    const conditionWithAuthorization = `${condition} authorization: ${!!this.props.authorityLevel}`;
    const expiration = moment(this.props.subscriptionStatus.expiration);
    const remainingDays = expiration.diff(moment(), 'days');
    switch (conditionWithAuthorization) {
      case 'school sponsored authorization: false':
        return this.nextPlanAlert(this.onceYourPlanExpires());
      case 'school expired authorization: false':
        return this.lessThan90Days();
      case 'school non-recurring authorization: true':
        if (remainingDays > 90) {
          return this.nextPlanAlert(this.contactSales());
        }
        return this.lessThan90Days();
      case 'school non-recurring authorization: false':
        if (remainingDays > 90) {
          return this.nextPlanAlert(this.onceYourPlanExpires());
        }
        return this.lessThan90Days();
      case 'recurring authorization: false':
        return this.nextPlanAlert(`Your Subscription will be renewed on ${renewDate}.`);
      case 'recurring authorization: true':
        return this.nextPlanAlert(`Your Subscription will be renewed on ${renewDate} and your card ending in ${this.state.lastFour} will be charged $${this.getPrice()}.`);
      case 'school expired authorization: true':
        return this.lessThan90Days();
      case 'school expired authorization: false':
        return this.lessThan90Days();
      case 'other expired authorization: false':
        return this.renewPremium();
      case 'other expired authorization: true':
        return this.renewPremium();
      default:
    }
  }

  getCondition() {
    switch (this.props.subscriptionType) {
      case 'School':
        return 'school';
      case 'School Sponsored':
        return 'school sponsored';
      default:
        return 'other';
    }
  }

  getPrice() {
    if (this.props.subscriptionType === 'School') {
      return '900';
    }
    return '80';
  }

  nextPlanContent() {
    let nextPlan;
    let beginsOn;
    let nextPlanAlertOrButtons;
    const condition = this.getCondition();
    if (this.props.subscriptionStatus.expired) {
      return this.nextPlanAlertOrButtons(`${condition} expired`);
    } else if (this.props.subscriptionStatus.account_type === 'Premium Credit') {
      const content = (<span>Quill Basic - Free
                    <a href="/premium" className="green-link">Change Plan</a>
      </span>);
      return (<TitleAndContent title={'Next Plan'} content={content} />);
    } else if (condition === 'school sponsored') {
      nextPlan = this.nextPlanAlertOrButtons(condition);
    } else if (this.props.subscriptionStatus.recurring) {
      nextPlan = (<span>
        {this.props.subscriptionType} Premium - ${this.getPrice()} Annual Subscription {this.changePlanInline()}
      </span>);
      const renewDate = moment(this.props.subscriptionStatus.expiration).add('days', 1).format('MMMM Do, YYYY');
      nextPlanAlertOrButtons = this.nextPlanAlertOrButtons('recurring', renewDate);
      beginsOn = (
        <TitleAndContent title={'Begins On'} content={renewDate} />
        );
    } else if (condition === 'school' && !this.props.subscriptionStatus.recurring) {
      nextPlanAlertOrButtons = this.nextPlanAlertOrButtons(`${condition} non-recurring`);
      nextPlan = <span>Quill Basic - Free {this.changePlanInline()}</span>;
    } else {
      nextPlanAlertOrButtons = this.nextPlanAlert(this.onceYourPlanExpires());
      nextPlan = <span>Quill Basic - Free {this.changePlanInline()}</span>;
    }
    return (
      <div>
        <div className="flex-row space-between">
          <TitleAndContent title={'Next Plan'} content={<span >{nextPlan}</span>} />
          {beginsOn}
        </div>
        {nextPlanAlertOrButtons}
      </div>
    );
  }

  nextPlan() {
    if (this.props.subscriptionStatus) {
      return (
        <div className="meta-section">
          <h3>NEXT SUBSCRIPTION</h3>
          {this.nextPlanContent()}
        </div>
      );
    }
  }

  content() {
    const currSub = this.props.subscriptionStatus;
    const metaRowClassName = 'sub-meta-info';
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
          <TitleAndContent title={'Plan'} content={'Quill Basic - Free'} />
        </div>
        {this.paymentMethod()}
        {this.nextPlan()}
      </div>
    ),
      cta: (
        <div className="sub-button-row">
          <a href="/premium" className="q-button button cta-button bg-orange text-white">Learn More About Quill Premium</a>
          <a target="_blank" rel="noopener noreferrer" href="https://assets.quill.org/documents/quill_premium.pdf" className="q-button button cta-button bg-quillblue text-white"><i className="fa fa-file-pdf-o" />Download Premium PDF</a>
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
