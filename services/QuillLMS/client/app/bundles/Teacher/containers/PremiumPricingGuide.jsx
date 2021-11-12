import React from 'react';

import QuestionsAndAnswers from './QuestionsAndAnswers.tsx'

import PurchaseModal from './PurchaseModal';
import PremiumConfirmationModal from '../components/subscriptions/premium_confirmation_modal';
import PremiumBannerBuilder from '../components/scorebook/premium_banners/premium_banner_builder.jsx'
import PremiumPricingMinisRow from '../components/premium/premium_pricing_minis_row.jsx';
import SubscriberLogos from '../components/premium/subscriber_logos.jsx';
import SchoolPremium from '../components/premium/school_premium.jsx';
import PremiumFeaturesTable from '../components/premium/premium_features_table.tsx'

const subscribers = [
   { name: 'Achievement first school logo', source: '/images/subscribers/1_achievement.png', id: 'achievement-first'},
   { name: 'KIPP: SF school logo', source: '/images/subscribers/2_kipp_sf.png', id: 'kipp-sf'},
   { name: 'KIPP: DC school logo', source: '/images/subscribers/3_kipp_dc.png', id: 'kipp-dc'},
   { name: 'KIPP: LA school logo', source: '/images/subscribers/4_kipp_la.png', id: 'kipp-la'},
   { name: 'Rocketship school logo', source: '/images/subscribers/5_kipp_rocketship.png', id: 'rocketship'},
   { name: 'Houston Independent School District logo', source: '/images/subscribers/6_houston.png', id: 'houston'},
   { name: 'Des Moines Public Schools logo', source: '/images/subscribers/7_desmoines.png', id: 'desmoines'},
   { name: 'Richmond Virginia Public Schools logo', source: '/images/subscribers/8_richmond.png', id: 'richmond'},
   { name: 'Putnam County Board of Education logo', source: '/images/subscribers/9_putnam.png', id: 'putnam'},
   { name: 'Elizabeth Public Schools logo', source: '/images/subscribers/10_elizabeth.png', id: 'elizabeth'},
   { name: 'North Thurston Public Schools logo', source: '/images/subscribers/11_thurston.png', id: 'thurston'},
   { name: 'Lead Public Schools logo', source: '/images/subscribers/12_lead.png', id: 'lead'},
   { name: 'Trinity Episcopal School logo', source: '/images/subscribers/13_trinity.png', id: 'trinity'},
   { name: 'Kuemper school logo', source: '/images/subscribers/14_kuemper.png', id: 'kuemper'},
   { name: 'Jordan School District logo', source: '/images/subscribers/15_jodan.png', id: 'jordan'},
   { name: 'Princeton Public Schools logo', source: '/images/subscribers/16_princeton.png', id: 'princeton'}
 ]

export default class PremiumPricingGuide extends React.Component {
  // const size = useWindowSize();
  // const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE
  //
  state = {
    showPremiumConfirmationModal: false,
    showPurchaseModal: false,
    subscriptionType: null,
    subscriptionStatus: null,
    userIsSignedIn: !!Number(document.getElementById('current-user-id').getAttribute('content')),
    isScrolled: false
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

  renderPremiumConfirmationModal = () => {
    const { showPremiumConfirmationModal, subscriptionStatus, } = this.state
    if (!showPremiumConfirmationModal) { return }
    return (<PremiumConfirmationModal
      hideModal={this.hidePremiumConfirmationModal}
      show={showPremiumConfirmationModal}
      subscription={subscriptionStatus}
    />)
  }

  renderPurchaseModal = () => {
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
    const { diagnosticActivityCount, independentPracticeActivityCount, lessonsActivityCount } = this.props
    const { userIsSignedIn } = this.state
    return (
      <div>
        <div className="container premium-page">
          {userIsSignedIn ? <PremiumBannerBuilder originPage="premium" showPurchaseModal={this.showPurchaseModal} /> : ''}
          <div className="overview text-center">
            <PremiumPricingMinisRow {...this.props} showPurchaseModal={this.showPurchaseModal} />
            <PremiumFeaturesTable
              diagnosticActivityCount={diagnosticActivityCount}
              independentPracticeActivityCount={independentPracticeActivityCount}
              lessonsActivityCount={lessonsActivityCount}
            />
          </div>

          <div className="features text-center">
            <SchoolPremium />
            <SubscriberLogos subscribers={subscribers} />
          </div>
          <QuestionsAndAnswers
            questionsAndAnswersFile="premium"
            supportLink="https://support.quill.org/quill-premium"
          />
        </div>
        {this.renderPremiumConfirmationModal()}
        {this.renderPurchaseModal()}
      </div>
    )
  }
}
