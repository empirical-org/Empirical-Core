import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Stripe from '../modules/stripe/charge.js';

export default class QuoteRequestModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isUserSignedIn: ($('#user-logged-in').data().signedIn === true),
    }
  }

  charge = () => {
    new Stripe(90000, '$900 per Year - School Premium');
  }

  handlePayNowClick = () => {
    const { isUserSignedIn, } = this.state
    if (isUserSignedIn) {
      this.charge();
    } else {
      alert('You must be logged in to activate Quill Premium.');
    }
  }

  creditCardNotice = () => {
    const { userHasSchool, } = this.props
    if (userHasSchool) {
      return (<p>To pay now with a credit card, please <span data-toggle="modal" onClick={this.handlePayNowClick}>click here</span>.</p>);
    }
    return (<p>To pay now via credit card, please visit your <a href="/teachers/my_account">account page</a> and add a school.</p>);
  }

  render() {
    const { hideModal, show, } = this.props
    return (
      <Modal {...this.props} dialogClassName="quote-request-modal" onHide={hideModal} show={show}>
        <Modal.Body>
          <h1 className="q-h2">Receive a quote for a purchase order.</h1>
          <a className="q-button cta-button bg-quillgreen text-white" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/" rel="noopener noreferrer" target="_blank">
                    Email a Quote
          </a>
        </Modal.Body>
        <Modal.Footer>
          {this.creditCardNotice()}
          <p>You can also call us at <a href="tel:510-671-0222">510-671-0222</a></p>
        </Modal.Footer>
      </Modal>
    );
  }

}
