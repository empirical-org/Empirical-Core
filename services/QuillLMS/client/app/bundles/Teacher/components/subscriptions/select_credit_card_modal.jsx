import React from 'react';
import request from 'request';
import capitalize from 'underscore.string/capitalize';
import Modal from 'react-bootstrap/lib/Modal';
import EnterOrUpdateStripeCard from '../modules/stripe/enter_or_update_card.js';
import getAuthToken from '../modules/get_auth_token';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      extantCardSelected: false,
      changeCardSelected: false,
      lastFour: this.props.lastFour,
    };
    this.toggleChangeCard = this.toggleChangeCard.bind(this);
    this.toggleExtantCard = this.toggleExtantCard.bind(this);
    this.updateLastFour = this.updateLastFour.bind(this);
    this.stripeCharge = this.stripeCharge.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  updateLastFour(newLastFour) {
    this.setState({ lastFour: newLastFour, extantCardSelected: true, changeCardSelected: false, });
  }

  toggleChangeCard() {
    this.setState({ extantCardSelected: false, changeCardSelected: !this.state.changeCardSelected, },
        () => {
          if (this.state.changeCardSelected) {
            new EnterOrUpdateStripeCard(this.updateLastFour, this.state.lastFour ? 'Update' : 'Enter');
          }
        }
    );
  }

  toggleExtantCard() {
    this.setState({ extantCardSelected: !this.state.extantCardSelected, changeCardSelected: false, });
  }

  showBuyNowIfChargeSelection() {
    if (this.state.extantCardSelected) {
      return <button className="button q-button button-green cta-button" onClick={this.stripeCharge}>Buy Now</button>;
    }
  }

  stripeCharge() {
    const that = this;
    request.post({ url: `${process.env.DEFAULT_URL}/charges/new_${this.props.type}_premium`, form: { authenticity_token: getAuthToken(), }, }, (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        that.props.updateSubscriptionStatus(JSON.parse(body).new_subscription);
      }
    });
  }

  loadingOrButtons() {
    if (!this.state.lastFour) {
      const className = `enter-credit-card ${this.state.extantCardSelected ? 'selected' : ''}`;
      return <button className={className} key="enter a card" onClick={this.toggleChangeCard}>Enter Credit Card</button>;
    }
    return ([
      <button className={`extant-card ${this.state.extantCardSelected ? 'selected' : ''}`} key="extant" onClick={this.toggleExtantCard}>Credit Card ending with {this.state.lastFour}</button>,
      <button className={`different-card ${this.state.extantCardSelected ? 'selected' : ''}`} key="change" onClick={this.toggleChangeCard}><i className="fas fa-credit-card" />Use a Different Card</button>
    ]);
  }

  hideModal() {
    if (this.props.setCreditCardToFalse) {
      this.props.setCreditCardToFalse();
    }
    this.props.hideModal();
  }

  h2IfPaymentInfo() {
    if (this.state.lastFour) {
      return (<h2 className="q-h2">Which credit card would you like to pay with?</h2>);
    }
  }

  render() {
    return (
      <Modal {...this.props} dialogClassName="select-credit-card-modal" onHide={this.props.hideModal} restoreFocus show={this.props.show}>
        <Modal.Body>
          <img alt="close-modal" className="pull-right react-bootstrap-close" onClick={this.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} />
          <div className="pricing-info text-center">
            <h1>Quill {capitalize(this.props.type)} Premium</h1>
            <span>${this.props.price} for one-year subscription</span>
          </div>
          {this.h2IfPaymentInfo()}
          {this.loadingOrButtons()}
          {this.showBuyNowIfChargeSelection()}
        </Modal.Body>
      </Modal>
    );
  }
}
