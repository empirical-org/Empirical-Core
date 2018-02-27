import React from 'react';
import SelectCreditCardModal from '../components/subscriptions/select_credit_card_modal';
import SchoolPremiuModal from '../components/subscriptions/school_premium_modal';

export default class PurchaseModal extends React.Component {

  render() {
    if (this.props.subscriptionType === 'School') {
      return <SchoolPremiuModal {...this.props} />;
    }
    return <SelectCreditCardModal {...this.props} />;
  }

}
