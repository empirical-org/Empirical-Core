import React from 'react';

import { premiumFeatures, } from './premium_features_data'
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
    isScrolled: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.listenScrollEvent)
  }

  listenScrollEvent = e => {
    const { isScrolled, } = this.state
    if (window.scrollY > 337 && !isScrolled) {
      this.setState({isScrolled: true})
    } else if (window.scrollY < 337 && isScrolled) {
      this.setState({isScrolled: false})
    }
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
    const { lastFour, diagnosticActivityCount, lessonsActivityCount, independentPracticeActivityCount, } = this.props

    const {
      userIsSignedIn,
      subscriptionStatus,
      subscriptionType,
      isScrolled,
    } = this.state

    const premiumFeatureData = premiumFeatures({ diagnosticActivityCount, lessonsActivityCount, independentPracticeActivityCount,})

    return (
      <React.Fragment>
        <div className="our-commitment">
          <img alt="Illustration of a handshake in a heart shape" src={handshakeHeartSrc} />
          <h3>Our commitment</h3>
          <p>As a nonprofit dedicated to helping students, Quill will always provide 100% of our activities for free.</p>
        </div>
        <div className={`pricing-minis-container ${isScrolled ? 'show-shadow': ''}`}>
          <div className="pricing-minis">
            <BasicPricingMini
              premiumFeatureData={premiumFeatureData}
              userIsSignedIn={userIsSignedIn}
            />
            <TeacherPricingMini
              {...this.props}
              hidePurchaseModal={this.hidePurchaseModal}
              premiumFeatureData={premiumFeatureData}
              showPurchaseModal={this.showPurchaseModal}
              userIsSignedIn={userIsSignedIn}
            />
            <SchoolPricingMini
              premiumFeatureData={premiumFeatureData}
            />
          </div>
        </div>
        {this.renderPremiumConfirmationModal()}
        {this.renderPurchaseModal()}
      </React.Fragment>
    );
  }
}
