import moment from 'moment';
import React from 'react';

import {
    CREDIT_CARD, SCHOOL_PREMIUM_SCHOLARSHIP, TEACHER_PREMIUM_CREDIT,
    TEACHER_PREMIUM_SCHOLARSHIP, TEACHER_PREMIUM_TRIAL
} from './constants';
import TitleAndContent from './current_subscription_title_and_content';

import { requestPost } from '../../../../modules/request';
import { defaultSnackbarTimeout, helpIcon, Snackbar, Tooltip } from '../../../Shared/index';

export default class CurrentSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAutomaticRenewalModal: false
    };
  }

  onceYourPlanExpires() {
    const { subscriptionType, subscriptionStatus, authorityLevel, } = this.props
    const { payment_method, purchaser_email, } = subscriptionStatus
    const baseText = `Once your current ${subscriptionType} subscription expires, you will be downgraded to Quill Basic.`;

    if ([TEACHER_PREMIUM_TRIAL, TEACHER_PREMIUM_CREDIT, TEACHER_PREMIUM_SCHOLARSHIP].includes(subscriptionType)) { return baseText }

    if (subscriptionType === SCHOOL_PREMIUM_SCHOLARSHIP && !authorityLevel) { return baseText }

    if (payment_method === CREDIT_CARD && authorityLevel) {
      return `${baseText} To prevent your subscription from expiring, turn on automatic renewal.`
    }
    if (payment_method === CREDIT_CARD && !authorityLevel) {
      return <span>{baseText} To prevent your subscription from expiring, contact the purchaser at <a href={`mailto:${purchaser_email}`}>{purchaser_email}</a> and ask them to turn on automatic renewal.</span>
    }
    if (payment_method !== CREDIT_CARD && (authorityLevel || !purchaser_email)) {
      return <span>{baseText} To renew your subscription for next year, <a href="https://quill.org/request_renewal" rel="noopener noreferrer">contact us</a>.</span>
    }
    if (payment_method !== CREDIT_CARD && !authorityLevel) {
      return <span>{baseText} To renew your subscription for next year, contact the purchaser at <a href={`mailto:${purchaser_email}`}>{purchaser_email}</a> or <a href="mailto:sales@quill.org">the Quill team</a>.</span>
    }
    return baseText
  }

  getPaymentMethod() {
    const { subscriptionStatus, authorityLevel, subscriptionType, } = this.props

    if (subscriptionStatus && subscriptionStatus.payment_method === CREDIT_CARD && authorityLevel) {
      return this.editCreditCardElement();
    } else if (subscriptionStatus && subscriptionStatus.payment_method === CREDIT_CARD) {
      return <span>Credit Card</span>;
    } else if (subscriptionType === TEACHER_PREMIUM_TRIAL) {
      return <span>No payment method on file</span>;
    } else if (subscriptionStatus && ['Invoice', 'School Invoice'].includes(subscriptionStatus.payment_method)) {
      return <span>Invoice</span>;
    }
    return <span>No payment method on file</span>;
  }

  getPrice() {
    const { subscriptionStatus, } = this.props
    return subscriptionStatus.renewal_price
  }

  contactSales() {
    return (
      <span>
        To renew your subscription for next year,
        <a href="https://quill.org/request_renewal" rel="noopener noreferrer">contact us now</a>.
      </span>
    )
  }

  content() {
    const { subscriptionStatus, purchaserNameOrEmail, subscriptionType, authorityLevel, } = this.props

    const metaRowClassName = 'sub-meta-info';
    if (subscriptionStatus) {
      const planTitleContent = (
        <span className="content-wrapper">
          {subscriptionType}
          <Tooltip
            tooltipText={`You have a ${subscriptionStatus.account_type} subscription`}
            tooltipTriggerText={<span><img alt={helpIcon.alt} className="subscription-tooltip" src={helpIcon.src} /></span>}
          />
        </span>
      )
      let automaticRenewalContent = subscriptionStatus.recurring ? 'On' : 'Off'

      if (authorityLevel && subscriptionStatus.payment_method !== CREDIT_CARD && !subscriptionStatus.recurring) {
        automaticRenewalContent = (
          <span className="content-wrapper">
            Off
            <Tooltip
              tooltipText="To renew your subscription for next year, contact us at https://quill.org/request_renewal."
              tooltipTriggerText={<span><img alt={helpIcon.alt} className="subscription-tooltip" src={helpIcon.src} /></span>}
            />
          </span>
        )
      }

      return ({ metaRows: (
        <div className={metaRowClassName}>
          <div className="meta-section">
            <h3>CURRENT SUBSCRIPTION</h3>
            <div className="flex-row space-between">
              <div>
                <TitleAndContent content={planTitleContent} title="Plan" />
                {purchaserNameOrEmail && purchaserNameOrEmail.length && <TitleAndContent content={purchaserNameOrEmail} title="Purchaser" />}
                <TitleAndContent content={automaticRenewalContent} title="Automatic Renewal" />
                {this.renderAutomaticRenewalButton()}
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
      <span>{`Credit card ending in ${last_four}`}
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
        >Edit credit card</button>
      </span>
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

  renewDate() {
    const { subscriptionStatus, } = this.props
    return moment(subscriptionStatus.expiration).add('days', 1).format('MMMM Do, YYYY');
  }

  nextPlanContent() {
    const { subscriptionStatus, subscriptionType, } = this.props

    if (subscriptionStatus.expired) { return }

    let nextPlan = <span>Quill Basic - Free</span>
    let beginsOn
    let nextPlanAlertOrButtons = this.nextPlanAlert(this.onceYourPlanExpires())

    if (subscriptionStatus.recurring) {
      nextPlan = (<span>{subscriptionType} - ${this.getPrice()} Annual Subscription</span>);
      nextPlanAlertOrButtons = this.nextPlanAlert(`Your ${subscriptionType} subscription will be renewed on ${this.renewDate()} and your card ending in ${subscriptionStatus.last_four} will be charged $${this.getPrice()}.`);
      beginsOn = (
        <TitleAndContent content={this.renewDate()} title="Begins On" />
      );
    }

    return (
      <div>
        <div className="flex-row space-between">
          <TitleAndContent content={nextPlan} title="Next Plan" />
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

  handleClickShowAutomaticRenewalModal = () => { this.setState({ showAutomaticRenewalModal: true, }) }

  handleClickHideAutomaticRenewalModal = () => { this.setState({ showAutomaticRenewalModal: false, }) }

  showSnackbar = snackbarCopy => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  };

  handleUpdateRecurringClick = () => {
    const { subscriptionStatus, updateSubscription } = this.props
    const { stripe_subscription_id, recurring, id, } = subscriptionStatus

    const newRecurringValue = !recurring
    const snackbarText = `Automatic renewal turned ${newRecurringValue ? 'on' : 'off'}.` // "recurring" is the old value, so the description is the inverse

    const callback = this.setState({ showAutomaticRenewalModal: false, }, () => {
      this.showSnackbar(snackbarText)
    })

    if (stripe_subscription_id) {
      const path = '/stripe_integration/subscription_renewals'
      const cancel_at_period_end = !newRecurringValue
      const data = { stripe_subscription_id, cancel_at_period_end }
      const success = () => { updateSubscription({ recurring: newRecurringValue }, id, callback) }

      const error = () => { alert('An error occurred updating the subscription. Please contact hello@quill.org.') }

      requestPost(path, data, success, error)
    } else {
      const callback = this.setState({
        showAutomaticRenewalModal: false,
      }, () => {
        this.showSnackbar(snackbarText)
      })
      updateSubscription({ recurring: newRecurringValue }, id, callback)
    }
  }

  renderAutomaticRenewalButton() {
    const { authorityLevel, subscriptionStatus, } = this.props

    if (authorityLevel && subscriptionStatus.payment_method === CREDIT_CARD) {
      return (
        <button
          className="quill-button medium primary contained focus-on-light"
          onClick={this.handleClickShowAutomaticRenewalModal}
          type="button"
        >
          {subscriptionStatus.recurring ? 'Turn off automatic renewal' : 'Turn on automatic renewal'}
        </button>
      );
    }
  }

  renderAutomaticRenewalModal() {
    const { authorityLevel, subscriptionStatus, subscriptionType, } = this.props
    const { showAutomaticRenewalModal, } = this.state

    if (!showAutomaticRenewalModal) { return <span /> }

    const { last_four, recurring, } = subscriptionStatus
    const expiration = moment(subscriptionStatus.expiration).format('MMMM Do, YYYY');
    const renewDate = moment(subscriptionStatus.expiration).add('days', 1).format('MMMM Do, YYYY');

    let header = 'Turn on automatic renewal?'
    let body = `By turning on automatic renewal, your subscription to ${subscriptionType} will be renewed on ${renewDate} and your card ending in ${last_four} will be charged $${this.getPrice()}.`
    let buttonText = 'Turn on'

    if (recurring) {
      header = 'Turn off automatic renewal?'
      body = `By turning off automatic renewal, your subscription to ${subscriptionType} will be canceled at the end of the current billing cycle (${expiration}) and you will be downgraded to Quill Basic.`
      buttonText = 'Turn off'
    }

    return (
      <div className="modal-container automatic-renewal-modal-container">
        <div className="modal-background" />
        <div className="automatic-renewal-modal quill-modal modal-body">
          <div>
            <h3 className="title">{header}</h3>
          </div>
          <p>{body}</p>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={this.handleClickHideAutomaticRenewalModal} type="button">Cancel</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={this.handleUpdateRecurringClick} type="button">{buttonText}</button>
          </div>
        </div>
      </div>
    )
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  render() {
    const { subscriptionStatus, } = this.props
    if (!subscriptionStatus || subscriptionStatus.expired) { return <span /> }

    const content = this.content();
    return (
      <section>
        {this.renderAutomaticRenewalModal()}
        <h2>Subscription Information</h2>
        <div className="current-subscription-information-and-cta">
          <div className="current-subscription-information">
            {content.metaRows}
          </div>
          {content.cta}
        </div>
        {this.renderSnackbar()}
      </section>
    );
  }
}
