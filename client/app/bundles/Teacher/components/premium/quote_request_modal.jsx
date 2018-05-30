import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Stripe from '../modules/stripe/charge.js';

export default React.createClass({

  getInitialState() {
    return {
      isUserSignedIn: ($('#user-logged-in').data().signedIn === true),
    };
  },

  charge() {
    new Stripe(90000, '$900 per Year - School Premium');
  },

  chargeOrLogin() {
    if (this.state.isUserSignedIn === true) {
      this.charge();
    } else {
      alert('You must be logged in to activate Quill Premium.');
    }
  },

  creditCardNotice() {
    if (this.props.userHasSchool) {
      return (<p>To pay now with a credit card, please <span data-toggle="modal" onClick={this.chargeOrLogin}>click here</span>.</p>);
    }
    return (<p>To pay now via credit card, please visit your <a href="/teachers/my_account">account page</a> and add a school.</p>);
  },

  render() {
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="quote-request-modal">
        <Modal.Body>
          <h1 className="q-h2">Receive a quote for a purchase order.</h1>
          <a className="q-button cta-button bg-quillgreen text-white" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/" target="_blank">
                    Email a Quote
                  </a>
        </Modal.Body>
        <Modal.Footer>
          {this.creditCardNotice()}
          <p>You can also call us at 646-442-1095 </p>
        </Modal.Footer>
      </Modal>
    );
  },

});
