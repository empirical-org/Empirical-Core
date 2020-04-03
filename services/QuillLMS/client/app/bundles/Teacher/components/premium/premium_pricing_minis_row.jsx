import React from 'react';
import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx';
import TeacherPricingMini from './premium_minis/teacher_pricing_mini.jsx';
import SchoolPricingMini from './premium_minis/school_pricing_mini.jsx';
import PremiumConfirmationModal from '../subscriptions/premium_confirmation_modal';
import PurchaseModal from '../../containers/PurchaseModal';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPremiumConfirmationModal: false,
      showPurchaseModal: false,
      subscriptionType: null,
      subscriptionStatus: null,
      userIsSignedIn: !!Number(document.getElementById('current-user-id').getAttribute('content')),
    };
  }

  hidePremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: false, });
  };

  hidePurchaseModal = () => {
    this.setState({ showPurchaseModal: false, subscriptionType: null, });
  };

  showPremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: true, });
  };

  showPurchaseModal = () => {
    this.setState({ showPurchaseModal: true, });
  };

  showPurchaseModalForSchoolPurchase = () => {
    this.setState({ subscriptionType: 'School', }, () => this.setState({ showPurchaseModal: true, }));
  };

  updateSubscriptionStatus = subscription => {
    this.setState({ subscriptionStatus: subscription,
      showPremiumConfirmationModal: true,
      showPurchaseModal: false, });
  };

  render() {
    return (
      <div className="premium-pricing-row row text-center">
        <div className="col-md-4">
          <BasicPricingMini />
        </div>
        <div className="col-md-4">
          <TeacherPricingMini
            {...this.props}
            hidePurchaseModal={this.hidePurchaseModal}
            showPurchaseModal={this.showPurchaseModal}
            userIsSignedIn={this.state.userIsSignedIn}
          />
        </div>
        <div className="col-md-4">
          <SchoolPricingMini
            {...this.props}
            hidePurchaseModal={this.hidePurchaseModal}
            showPurchaseModal={this.showPurchaseModalForSchoolPurchase}
            userIsSignedIn={this.state.userIsSignedIn}
          />
        </div>
        <PremiumConfirmationModal
          hideModal={this.hidePremiumConfirmationModal}
          show={this.state.showPremiumConfirmationModal}
          subscription={this.state.subscriptionStatus}
        />
        <PurchaseModal
          hideModal={this.hidePurchaseModal}
          lastFour={this.props.lastFour}
          show={this.state.showPurchaseModal}
          subscriptionType={this.state.subscriptionType}
          updateSubscriptionStatus={this.updateSubscriptionStatus}
        />
      </div>
    );
  }
}
