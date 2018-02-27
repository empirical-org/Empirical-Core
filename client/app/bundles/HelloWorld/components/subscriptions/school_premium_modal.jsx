import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import UpdateStripeCard from '../modules/stripe/update_card.js';
import getAuthToken from '../modules/get_auth_token';
import request from 'request';

export default class extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   extantCardSelected: false,
    //   changeCardSelected: false,
    //   lastFour: this.props.lastFour,
    // };
    // this.toggleChangeCard = this.toggleChangeCard.bind(this);
    // this.toggleExtantCard = this.toggleExtantCard.bind(this);
    // this.updateLastFour = this.updateLastFour.bind(this);
    // this.stripeCharge = this.stripeCharge.bind(this);
  }

  render() {
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="school-premium-modal" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <div className="pricing-info text-center">
            <h1>Quill School Premium</h1>
            <span>$900 for one-year subscription</span>
            <span>Next Years Rate is $1800</span>
          </div>
          <div className="cta-section">
            <h3>How would you like to renew your School’s Premium subscription?</h3>
            <div>
              <button className="bg-quillgreen text-white">Email Me a Quote</button>
              <button className="bg-quillgreen text-white">Pay with Credit Card</button>
            </div>
          </div>
          <div className="not-the-purchaser-section">
            <h3>Not the Purchaser</h3>
            <p>
              <span>Credit Card Purchaser:</span>
              Reach out to your school purchaser and ask them to login to Quill and renew the subscription.
            </p>
            <p>
              <span>Quote Purchaser:</span>
              Quote purchase: Click on <i>Email Me A Quote</i> and forward the quote to your school’s purchaser.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
