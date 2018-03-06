import React from 'react';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscription: props.subscription,
      purchaserEmail: props.purchaserEmail,
    };
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
    this.updatePaymentAmount = this.updatePaymentAmount.bind(this);
    this.updatePurchaserEmail = this.updatePurchaserEmail.bind(this);
  }

  handleAccountTypeChange(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  handlePaymentMethodChange(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_method = e;
    this.setState({ subscription: newSub, });
  }

  updatePaymentAmount(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_method = e.target.value * 100;
    this.setState({ subscription: newSub, });
  }

  updatePurchaserEmail(e) {
    this.setState({ purchaserEmail: e.target.value, });
  }

  render() {
    const schoolOrUser = this.props.school || this.props.user;
    return (
      <div>
        <h1>Edit Subscription: {schoolOrUser.name}</h1>
        <h2>Subscription Information</h2>
        <label>Premium Status</label>
        <ItemDropdown
          items={this.props.userPremiumTypes}
          callback={this.handleAccountTypeChange}
          selectedItem={this.state.subscription.account_type || ''}
        />
        <label>Created At:</label>
        <span>this.props.subscription.created</span>
        <h2>Payment Information</h2>
        <label>Payment Method</label>
        <ItemDropdown
          items={this.props.subscriptionPaymentMethods}
          callback={this.handlePaymentMethodChange}
          selectedItem={this.state.subscription.payment_method || ''}
        />
        <label>Payment Amount (dollar value as integer -- no decimal or symbol)</label>
        <input onChange={this.updatePaymentAmount} type="text" value={this.state.subscription.payment_amount / 100} />
        <h2>Purchaser Information</h2>
        <label>Purchaser Email</label>
        <input type="text" value={this.props.purchaserEmail} onChange={this.changePurchaserEmail} />
      </div>);
  }
}
