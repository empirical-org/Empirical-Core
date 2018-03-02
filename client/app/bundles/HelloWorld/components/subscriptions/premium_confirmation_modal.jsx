import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import moment from 'moment';
import pluralize from 'pluralize';

export default React.createClass({

  getModalContent() {
    const startD = moment(this.props.subscription.start_date);
    const endD = moment(this.props.subscription.expiration);
    const duration = endD.diff(startD, 'days');
    if (this.props.subscription.account_type === 'Premium Credit') {
      return <p key="subscription-p">You have redeemed your {duration} {pluralize('day', duration)} of Quill Premium Credit. Your Teacher Premium is valid until <strong>{moment(endD).format('MMMM Do, YYYY')}</strong>. You can view your subscription information or purchase a Teacher or a School Premium at any point on your subscription page.</p>;
    }
    return this.paymentCopy(startD, endD, duration);
  },

  paymentCopy(startD, endD) {
    return (
      <span>
        We have received your payment. You will receive an email shortly with your receipt. Your {this.props.subscriptionType} Premium is valid until <strong>{moment(endD).format('MMMM Do, YYYY')}</strong>. Your subscription will auto-renew {moment(endD).format('MMMM Do, YYYY')}. You can review your subscription information and modify your renewal settings on the subscription page.
      </span>
    );
  },

  render() {
    if (!this.props.subscription) {
      // this will never show with no subscription, but is on the page (with display none)
      return <span />;
    }
    const content = this.getModalContent();
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="premium-confirmation" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <h1>Congratulations!</h1>
          <h2>You have a {this.props.subscription.account_type} Subscription</h2>
          {content}
          <a className="q-button button cta-button bg-orange text-white" href="/teachers/progress_reports/activities_scores_by_classroom">View Premium Reports</a>
        </Modal.Body>
      </Modal>
    );
  },

});
