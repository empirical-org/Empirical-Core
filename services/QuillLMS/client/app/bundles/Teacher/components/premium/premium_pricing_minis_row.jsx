import React from 'react';
import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx';
import TeacherPricingMini from './premium_minis/teacher_pricing_mini.jsx';
import SchoolPricingMini from './premium_minis/school_pricing_mini.jsx';
import PremiumConfirmationModal from '../subscriptions/premium_confirmation_modal';
import PurchaseModal from '../../containers/PurchaseModal';

const handshakeHeartSrc = `${process.env.CDN_URL}/images/icons/handshake-heart.svg`

export default class PremiumPricingMinisRow extends React.Component {
  state = {
    showPremiumConfirmationModal: false,
    showPurchaseModal: false,
    subscriptionType: null,
    subscriptionStatus: null,
    userIsSignedIn: !!Number(document.getElementById('current-user-id').getAttribute('content')),
  };

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

  renderPremiumConfirmationModal() {
    const { showPremiumConfirmationModal, subscriptionStatus, } = this.state
    if (!showPremiumConfirmationModal) { return }
    return (<PremiumConfirmationModal
      hideModal={this.hidePremiumConfirmationModal}
      show={showPremiumConfirmationModal}
      subscription={subscriptionStatus}
    />)
  }

  renderPurchaseModal() {
    const {
      showPurchaseModal,
      subscriptionType
    } = this.state
    const { lastFour, } = this.props
    if (!showPurchaseModal) { return }
    return (<PurchaseModal
      hideModal={this.hidePurchaseModal}
      lastFour={lastFour}
      show={showPurchaseModal}
      subscriptionType={subscriptionType}
      updateSubscriptionStatus={this.updateSubscriptionStatus}
    />)
  }

  render() {
    const { lastFour, } = this.props

    const {
      userIsSignedIn,
      subscriptionStatus,
      subscriptionType,
    } = this.state

    return (
      <div className="premium-pricing-row text-center">
        <div className="our-commitment">
          <img src={handshakeHeartSrc} />
          <h3>Our commitment</h3>
          <p>As a nonprofit dedicated to helping students, Quill will always provide 100% of our activities for free.</p>
        </div>
        <BasicPricingMini
          userIsSignedIn={userIsSignedIn}
        />
        <TeacherPricingMini
          {...this.props}
          hidePurchaseModal={this.hidePurchaseModal}
          showPurchaseModal={this.showPurchaseModal}
          userIsSignedIn={userIsSignedIn}
        />
        <SchoolPricingMini />
        {this.renderPremiumConfirmationModal()}
        {this.renderPurchaseModal()}
      </div>
    );
  }
}
