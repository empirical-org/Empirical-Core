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
      return (
      [<h2 key="subscription-h2">You have a Teacher Premium Subscription</h2>,
        <p key="subscription-p">You have redeemed your {duration} {pluralize('day', duration)} of Quill Premium Credit. Your Teacher Premium is valid  until {moment(endD).format('MMMM Do, YYYY')}. You can view your subscription information or purchase a Teacher or a School Premium at any point on your subscription page.</p>]
      );
    }
  },

  render() {
    const content = this.getModalContent();
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <h1>Congratulations!</h1>
          {content}
        </Modal.Body>
      </Modal>
    );
  },

});
