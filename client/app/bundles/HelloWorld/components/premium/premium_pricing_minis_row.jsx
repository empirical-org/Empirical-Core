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
    this.showPremiumConfirmationModal = this.showPremiumConfirmationModal.bind(this);
    this.showPurchaseModal = this.showPurchaseModal.bind(this);
    this.hidePremiumConfirmationModal = this.hidePremiumConfirmationModal.bind(this);
    this.hidePurchaseModal = this.hidePurchaseModal.bind(this);
    this.updateSubscriptionStatus = this.updateSubscriptionStatus.bind(this);
    this.showPurchaseModalForSchoolPurchase = this.showPurchaseModalForSchoolPurchase.bind(this);
  }

  showPremiumConfirmationModal() {
    this.setState({ showPremiumConfirmationModal: true, });
  }

  hidePremiumConfirmationModal() {
    this.setState({ showPremiumConfirmationModal: false, });
  }

  showPurchaseModal() {
    this.setState({ showPurchaseModal: true, });
  }

  hidePurchaseModal() {
    this.setState({ showPurchaseModal: false, subscriptionType: null, });
  }

  showPurchaseModalForSchoolPurchase() {
    this.setState({ subscriptionType: 'School', }, () => this.setState({ showPurchaseModal: true, }));
  }

  updateSubscriptionStatus(subscription) {
    this.setState({ subscriptionStatus: subscription,
      showPremiumConfirmationModal: true,
      showPurchaseModal: false, });
  }

  render() {
    return (
      <div className="row text-center">
        <div className="col-md-4">
          <BasicPricingMini />
        </div>
        <div className="col-md-4">
          <TeacherPricingMini
            {...this.props}
            showPurchaseModal={this.showPurchaseModal}
            hidePurchaseModal={this.hidePurchaseModal}
            userIsSignedIn={this.state.userIsSignedIn}
          />
        </div>
        <div className="col-md-4">
          <SchoolPricingMini
            {...this.props}
            userIsSignedIn={this.state.userIsSignedIn}
            showPurchaseModal={this.showPurchaseModalForSchoolPurchase}
            hidePurchaseModal={this.hidePurchaseModal}
          />
        </div>
        <PremiumConfirmationModal
          show={this.state.showPremiumConfirmationModal}
          hideModal={this.hidePremiumConfirmationModal}
          subscription={this.state.subscriptionStatus}
        />
        <PurchaseModal
          show={this.state.showPurchaseModal}
          subscriptionType={this.state.subscriptionType}
          hideModal={this.hidePurchaseModal}
          lastFour={this.props.lastFour}
          updateSubscriptionStatus={this.updateSubscriptionStatus}
        />
      </div>
    );
  }
}
