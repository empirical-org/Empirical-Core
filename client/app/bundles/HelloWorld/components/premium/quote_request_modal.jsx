import React from 'react'
import Modal from 'react-bootstrap/lib/Modal';
import Stripe from '../modules/stripe.jsx'
export default React.createClass ({

  getInitialState: function() {
      return {
          isUserSignedIn: ($('#user-logged-in').data().signedIn === true)
      };
  },


  charge: function() {
      new Stripe(45000, '$450 School Premium');
  },

  chargeOrLogin: function() {
    if (this.state.isUserSignedIn === true) {
      this.charge();
    } else {
      alert('You must be logged in to purchase Quill Premium.')
    }
  },

  render: function() {
      return (
          <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='quote-request-modal'>
              <Modal.Body>
                  <h1 className='q-h2'>Receive a quote for a purchase order.</h1>
                  <a className="q-button cta-button bg-quillgreen text-white" href='https://quillpremium.wufoo.com/forms/quill-premium-quote/' target="_blank">
                    Email a Quote
                  </a>
              </Modal.Body>
              <Modal.Footer>
                <p>To pay now with a credit card, please <span data-toggle="modal" onClick={this.chargeOrLogin}>click here</span>.</p>
                <p>You can also call us at 646-442-1095 </p>
              </Modal.Footer>
          </Modal>
      )
  }

});
