import React from 'react';
import SelectCreditCardModal from '../components/subscriptions/select_credit_card_modal';
import SchoolPremiumModal from '../components/subscriptions/school_premium_modal';

export default class PurchaseModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schoolPremiumCreditCard: false,
    };
    this.purchaseSchoolPremium = this.purchaseSchoolPremium.bind(this);
    this.setCreditCardToFalse = this.setCreditCardToFalse.bind(this);
  }

  setCreditCardToFalse() {
    this.setState({ readyForSchoolPremiumPurchase: false, });
  }

  purchaseSchoolPremium() {
    this.setState({ readyForSchoolPremiumPurchase: true, });
  }

  render() {
    if (this.state.readyForSchoolPremiumPurchase) {
      return <SelectCreditCardModal price={900} type={'school'} setCreditCardToFalse={this.setCreditCardToFalse} {...this.props} />;
    } else if (this.props.subscriptionType === 'School') {
      return <SchoolPremiumModal purchaseSchoolPremium={this.purchaseSchoolPremium} {...this.props} />;
    }
    return <SelectCreditCardModal price={80} type={'teacher'} {...this.props} />;
  }

}
