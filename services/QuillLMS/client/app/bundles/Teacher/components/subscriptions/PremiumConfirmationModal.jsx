import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

import { ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES } from './constants';

export default class PremiumConfirmationModal extends React.Component {
  getModalContent = () => {
    const { subscription } = this.props
    const { account_type, expiration, start_date } = subscription
    const startDate = moment(start_date);
    const endDate = moment(expiration);
    const duration = endDate.diff(startDate, 'days');
    const formattedEndDate = moment(endDate).format('MMMM Do, YYYY')
    const formattedDuration = `${duration} ${pluralize('day', duration)}`

    if (account_type === 'Premium Credit') {
      return (
        <p key="subscription-p">
          You have redeemed your {formattedDuration} of Quill Premium Credit. Your Teacher Premium
          is valid until <strong>{formattedEndDate}</strong>. You can view your subscription
          information or purchase a Teacher or a School Premium at any point on your subscription page.
        </p>
      )
    }
    return this.paymentCopy(formattedEndDate);
  }

  paymentCopy = (formattedEndDate) => {
    const { subscription } = this.props
    const { account_type } = subscription
    const subscriptionType = ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES[account_type]

    return (
      <span>
        We have received your payment. You will receive an email shortly with your receipt. Your {subscriptionType} is
        valid until <strong>{formattedEndDate}</strong>. Your subscription will auto-renew {formattedEndDate}. You can
        review your subscription information and modify your renewal settings on the subscription page.
      </span>
    )
  }

  render() {
    const { hideModal, show, subscription } = this.props
    if (!subscription || !show) { return <span /> }

    const content = this.getModalContent()
    const { account_type } = subscription
    const subscriptionType = ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES[account_type]

    return (
      <div className="premium-confirmation">
        <div className="modal-background" />
        <div className="modal-content">
          <button
            className="interactive-wrapper focus-on-light pull-right"
            onClick={hideModal}
            type="button"
          >
            <img
              alt="close-modal"
              className="modal-button-close"
              src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/close_x.svg`}
            />
          </button>
          <h1>Congratulations!</h1>
          <h2 id="subscription-type">You have a {subscriptionType} Subscription</h2>
          {content}
          <a
            className="q-button button cta-button bg-orange text-white view-premium-reports"
            href="/teachers/progress_reports/activities_scores_by_classroom"
            id="view-premium-reports-button"
          >
            View Premium Reports
          </a>
        </div>
      </div>
    )
  }
}
