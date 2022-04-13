import React from 'react';
import SchoolPremiumModal from '../components/subscriptions/school_premium_modal';

export default class PurchaseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolPremiumCreditCard: false,
    };
  }

  setCreditCardToFalse = () => {
    this.setState({ readyForSchoolPremiumPurchase: false, });
  };

  purchaseSchoolPremium = () => {
    this.setState({ readyForSchoolPremiumPurchase: true, });
  };

  render() {
    if (this.props.subscriptionType === 'School') {
      return <SchoolPremiumModal purchaseSchoolPremium={this.purchaseSchoolPremium} {...this.props} />;
    }
  }
}
