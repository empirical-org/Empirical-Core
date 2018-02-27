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
  }

  purchaseSchoolPremium() {
    this.setState({ schoolPremiumPurchase: true, });
  }

  render() {
    if (this.state.schoolPremiumPurchase) {
      return <SelectCreditCardModal {...this.props} />;
    } else if (this.props.subscriptionType === 'School') {
      return <SchoolPremiumModal purchaseSchoolPremium={this.purchaseSchoolPremium} {...this.props} />;
    }
    return <SelectCreditCardModal {...this.props} />;
  }

}
