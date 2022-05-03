import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import ChangePlan from './change_plan';
import TitleAndContent from './current_subscription_title_and_content';
import { TEACHER_PREMIUM_TRIAL, SCHOOL_PREMIUM, DISTRICT_PREMIUM } from './constants';

import { Tooltip, helpIcon, } from '../../../Shared/index'
import { requestPost } from '../../../../modules/request';

export default class CurrentSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangePlan: false,
      recurring: _.get(props.subscriptionStatus, 'recurring'),
    };
  }

  onceYourPlanExpires() {
    const { subscriptionType, } = this.props
    return `Once your current ${subscriptionType} subscription expires, you will be downgraded to the Quill Basic subscription.`;
  }

  getCondition() {
    const { subscriptionType, } = this.props
    if ([SCHOOL_PREMIUM, DISTRICT_PREMIUM].includes(subscriptionType)) {
      return 'school'
    } else {
      return 'other'
    }
  }

  getPaymentMethod() {
    const { subscriptionStatus, authorityLevel, subscriptionType, } = this.props

    if (subscriptionStatus && subscriptionStatus.payment_method === 'Credit Card' && authorityLevel) {
      return this.editCreditCardElement();
    } else if (subscriptionStatus && subscriptionStatus.payment_method === 'Credit Card') {
      return <span>Credit Card</span>;
    } else if (subscriptionType === TEACHER_PREMIUM_TRIAL) {
      return <span>No Payment Method on File</span>;
    } else if (subscriptionStatus && ['Invoice', 'School Invoice'].includes(subscriptionStatus.payment_method)) {
      return <span>Invoice</span>;
    }
    return <span>No Payment Method on File</span>;
  }

  getPrice() {
    const { subscriptionType, } = this.props
    if ([DISTRICT_PREMIUM, SCHOOL_PREMIUM].includes(subscriptionType)) {
      return '900';
    }
    return '80';
  }

  changePlan() {
    const { showChangePlan, recurring, } = this.state
    const { subscriptionType, } = this.props

    if (showChangePlan) {
      return (
        <ChangePlan
          changeRecurringStatus={this.changeRecurringStatus}
          price={this.getPrice()}
          recurring={recurring}
          subscriptionType={subscriptionType}
        />
      );
    }
  }

  changePlanInline() {
    const { authorityLevel, subscriptionStatus, } = this.props
    const { showChangePlan, } = this.state

    if (authorityLevel && subscriptionStatus.payment_method === 'Credit Card') {
      return (
        <span key={`change-plan${showChangePlan}`}>
          <button
            className="green-link interactive-wrapper focus-on-light"
            onClick={showChangePlan ? this.updateRecurring : this.showChangePlan}
            type="button"
          >
            {showChangePlan ? 'Save Change' : 'Change Plan'}
          </button>
          {this.changePlan()}
        </span>
      );
    }
  }

  changeRecurringStatus = status => {
    this.setState({ recurring: status, })
  }

  contactSales() {
    return (
      <span>
        To renew your subscription for next year, contact us now
        at <a href="mailto:sales@quill.org">sales@quill.org</a>.
      </span>
    )
  }

  content() {
    const { subscriptionStatus, purchaserNameOrEmail, subscriptionType } = this.props

    const metaRowClassName = 'sub-meta-info';
    if (subscriptionStatus) {
      const titleContent = (
        <span>
          {subscriptionType}
          <Tooltip
            tooltipText={`You have a ${subscriptionStatus.account_type} subscription`}
            tooltipTriggerText={<span><img alt={helpIcon.alt} className="subscription-tooltip" src={helpIcon.src} /></span>}
          />
        </span>
      )
      return ({ metaRows: (
        <div className={metaRowClassName}>
          <div className="meta-section">
            <h3>CURRENT SUBSCRIPTION</h3>
            <div className="flex-row space-between">
              <div>
                <TitleAndContent content={titleContent} title="Plan" />
                {purchaserNameOrEmail && purchaserNameOrEmail.length && <TitleAndContent content={purchaserNameOrEmail} title="Purchaser" />}
              </div>
              <div>
                <TitleAndContent content={moment(subscriptionStatus.start_date).format('MMMM Do, YYYY')} title="Start Date" />
                <TitleAndContent content={moment(subscriptionStatus.expiration).format('MMMM Do, YYYY')} title="End Date" />
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
          <TitleAndContent content="Quill Basic - Free" title="Plan" />
        </div>
        {this.paymentMethod()}
        {this.nextPlan()}
      </div>
    ),
    cta: (
      <div className="sub-button-row">
        <a className="q-button button cta-button bg-orange text-white" href="/premium">Learn More About Quill Premium</a>
        <a className="q-button button cta-button bg-quillblue text-white" href="https://assets.quill.org/documents/quill_premium.pdf" rel="noopener noreferrer" target="_blank"><i className="fas fa-file-pdf" />Download Premium PDF</a>
      </div>
    ), });
  }

  handleEditCreditCardClick = () => {
    const { subscriptionStatus } = this.props
    const { stripe_customer_id, stripe_subscription_id } = subscriptionStatus

    if ( !stripe_customer_id ) { return }

    const path = '/stripe_integration/subscription_payment_methods'
    const data = { stripe_customer_id, stripe_subscription_id }

    requestPost(path, data, body => { window.location.replace(body.redirect_url) })
  }

  editCreditCardElement() {
    const { subscriptionStatus } = this.props
    const { last_four } = subscriptionStatus

    return (
      <span>{`Credit Card ending in ${last_four}`}
        <button
          className="interactive-wrapper focus-on-light"
          onClick={this.handleEditCreditCardClick}
          style={{
            color: '#027360',
            fontSize: '14px',
            paddingLeft: '10px',
            cursor: 'pointer',
          }}
          type="button"
        >Edit Credit Card</button>
      </span>
    );
  }

  lessThan90Days() {
    const { showPurchaseModal, } = this.props

    return (
      <div>
        <button
          className="q-button bg-orange text-white"
          onClick={showPurchaseModal}
          type="button"
        >
            Renew Subscription
        </button>
      </div>
    );
  }

  renewPremium() {
    const { showPurchaseModal, } = this.props

    return (
      <div>
        <button
          className="renew-subscription q-button bg-orange text-white cta-button"
          onClick={showPurchaseModal}
          type="button"
        >
          Renew Subscription
        </button>
      </div>
    );
  }

  nextPlan() {
    const { subscriptionStatus, } = this.props

    if (subscriptionStatus) {
      return (
        <div className="meta-section">
          <h3>NEXT SUBSCRIPTION</h3>
          {this.nextPlanContent()}
        </div>
      );
    }
  }

  nextPlanAlert(body) {
    return (
      <div className="next-plan-alert flex-row vertically-centered">
        <i className="fas fa-icon fa-lightbulb-o" />
        {body}
      </div>
    )
  }

  nextPlanAlertOrButtons(condition, renewDate) {
    const { authorityLevel, subscriptionStatus, } = this.props
    const { last_four } = subscriptionStatus
    const conditionWithAuthorization = `${condition} authorization: ${!!authorityLevel}`;
    const expiration = moment(subscriptionStatus.expiration);
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
        return this.nextPlanAlert(`Your subscription will be renewed on ${renewDate}.`);
      case 'recurring authorization: true':
        return this.nextPlanAlert(`Your subscription will be renewed on ${renewDate} and your card ending in ${last_four} will be charged $${this.getPrice()}.`);
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

  nextPlanContent() {
    const { subscriptionStatus, subscriptionType, } = this.props
    let nextPlan;
    let beginsOn;
    let nextPlanAlertOrButtons;
    const condition = this.getCondition();
    if (subscriptionStatus.expired) {
      return this.nextPlanAlertOrButtons(`${condition} expired`);
    } else if (subscriptionStatus.account_type === 'Premium Credit') {
      const content = (<span>Quill Basic - Free
        <a className="green-link" href="/premium">Change Plan</a>
      </span>);
      return (<TitleAndContent content={content} title="Next Plan" />);
    } else if (condition === 'school sponsored') {
      nextPlan = this.nextPlanAlertOrButtons(condition);
    } else if (subscriptionStatus.recurring) {
      nextPlan = (<span>
        {subscriptionType} - ${this.getPrice()} Annual Subscription {this.changePlanInline()}
      </span>);
      const renewDate = moment(subscriptionStatus.expiration).add('days', 1).format('MMMM Do, YYYY');
      nextPlanAlertOrButtons = this.nextPlanAlertOrButtons('recurring', renewDate);
      beginsOn = (
        <TitleAndContent content={renewDate} title="Begins On" />
      );
    } else if (condition === 'school' && !subscriptionStatus.recurring) {
      nextPlanAlertOrButtons = this.nextPlanAlertOrButtons(`${condition} non-recurring`);
      nextPlan = <span>Quill Basic - Free {this.changePlanInline()}</span>;
    } else {
      nextPlanAlertOrButtons = this.nextPlanAlert(this.onceYourPlanExpires());
      nextPlan = <span>Quill Basic - Free {this.changePlanInline()}</span>;
    }
    return (
      <div>
        <div className="flex-row space-between">
          <TitleAndContent content={<span >{nextPlan}</span>} title="Next Plan" />
          {beginsOn}
        </div>
        {nextPlanAlertOrButtons}
      </div>
    );
  }

  paymentMethod() {
    return (
      <div className="meta-section payment">
        <h3>PAYMENT METHOD ON FILE</h3>
        {this.getPaymentMethod()}
      </div>
    );
  }

  showChangePlan = () => { this.setState({ showChangePlan: true, }) }

  updateRecurring = () => {
    const { subscriptionStatus, updateSubscription } = this.props
    const { stripe_subscription_id } = subscriptionStatus
    const { recurring } = this.state

    if (stripe_subscription_id) {
      const path = '/stripe_integration/subscription_renewals'
      const cancel_at_period_end = !recurring
      const data = { stripe_subscription_id, cancel_at_period_end }
      const success = () => { updateSubscription({ recurring }, _.get(subscriptionStatus, 'id')) }

      const error = () => { alert('An error occurred updating the subscription. Please contact hello@quill.org.') }

      requestPost(path, data, success, error)
    } else {
      updateSubscription({ recurring }, _.get(subscriptionStatus, 'id'))
    }
  }

  render() {
    const { subscriptionStatus, } = this.props
    if (!subscriptionStatus || subscriptionStatus.expired) { return <span /> }

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
