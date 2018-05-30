import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.redeemIfNoCurrentSub = this.redeemIfNoCurrentSub.bind(this);
  }

  redeemIfNoCurrentSub() {
    if (this.props.userHasValidSub) {
      alert('You cannot redeem credits while you have a valid subscription. You must wait until your current subscription has expired to redeem them.');
    } else {
      this.props.redeemPremiumCredits;
    }
  }

  render() {
    let button;
    if (this.props.availableCredits > 0) {
      button = <button onClick={this.redeemIfNoCurrentSub} className="q-button cta-button bg-orange has-credit">Redeem Premium Credits</button>;
    } else {
      button = <a href="/" className="q-button button cta-button bg-orange">Earn Premium Credits</a>;
    }
    const monthsOfCredit = Math.round((this.props.availableCredits / 30.42) * 10) / 10;
    const whiteIfNoCredit = monthsOfCredit === 0 ? 'no-credits' : null;
    return (
      <div className={`${whiteIfNoCredit} available-credit flex-row vertically-centered space-between`}>
        <div className="credit-quantity">
          You have <span>{`${monthsOfCredit} ${pluralize('month', monthsOfCredit)} `}</span> of Teacher Premium Credit available.
        </div>
        {button}
      </div>
    );
  }

}
