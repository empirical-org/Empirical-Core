import React from 'react';
import request from 'request';
import capitalize from 'underscore.string/capitalize';

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
  }

  h2IfPaymentInfo() {
    const { lastFour } = this.state
    if (lastFour) {
      return (<h2 className="q-h2">Which credit card would you like to pay with?</h2>);
    }
  }

  hideModal = () => {
    const { hideModal, setCreditCardToFalse } = this.props
    if (setCreditCardToFalse) {
      setCreditCardToFalse();
    }
    hideModal();
  };

  loadingOrButtons() {
    const { extantCardSelected, lastFour } = this.state
    if (!lastFour) {
      const className = `enter-credit-card ${extantCardSelected ? 'selected' : ''}`;
      return <button className={className} key="enter a card" onClick={this.toggleChangeCard}>Enter Credit Card</button>;
    }
    return ([
      <button className={`extant-card ${extantCardSelected ? 'selected' : ''}`} key="extant" onClick={this.toggleExtantCard}>Credit Card ending with {lastFour}</button>,
      <button className={`different-card ${extantCardSelected ? 'selected' : ''}`} key="change" onClick={this.toggleChangeCard}><i className="fas fa-credit-card" />Use a Different Card</button>
    ]);
  }

  showBuyNowIfChargeSelection() {
    const { extantCardSelected } = this.state
    if (extantCardSelected) {
      return <button className="button q-button button-green cta-button" onClick={this.stripeCharge}>Buy Now</button>;
    }
  }

  stripeCharge = () => {
    const { updateSubscriptionStatus } = this.props
    request.post({ url: `${process.env.DEFAULT_URL}/charges/new_${this.props.type}_premium`, form: { authenticity_token: getAuthToken(), }, }, (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        updateSubscriptionStatus(JSON.parse(body).new_subscription);
      }
    });
  };

  toggleChangeCard = () => {
    this.setState({ extantCardSelected: false, changeCardSelected: !this.state.changeCardSelected, },
        () => {
          if (this.state.changeCardSelected) {
            new EnterOrUpdateStripeCard(this.updateLastFour, this.state.lastFour ? 'Update' : 'Enter');
          }
        }
    );
  };

  toggleExtantCard = () => {
    this.setState({ extantCardSelected: !this.state.extantCardSelected, changeCardSelected: false, });
  };

  updateLastFour = newLastFour => {
    this.setState({ lastFour: newLastFour, extantCardSelected: true, changeCardSelected: false, });
  };

  render() {
    const { price, show, type } = this.props
    if(!show) {
      return <span />
    } else {
      return (
        <div className="select-credit-card-modal">
          <div className="modal-background" />
          <div className="modal-content">
            <img alt="close-modal" className="pull-right modal-button-close" onClick={this.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} />
            <div className="pricing-info text-center">
              <h1>Quill {capitalize(type)} Premium</h1>
              <span>${price} for one-year subscription</span>
            </div>
            {this.h2IfPaymentInfo()}
            {this.loadingOrButtons()}
            {this.showBuyNowIfChargeSelection()}
          </div>
        </div>
      )
    }
  }
}
