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

export const PremiumPricingGuide = ({ lastFour, diagnosticActivityCount, independentPracticeActivityCount, lessonsActivityCount, userIsEligibleForNewSubscription }) => {
  // const size = useWindowSize();
  // const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE
  //
  const [shouldShowPremiumConfirmationModal, setShouldShowPremiumConfirmationModal] = React.useState(false)
  const [shouldShowPurchaseModal, setShouldShowPurchaseModal] = React.useState(false)
  const [subscriptionType, setSubscriptionType] = React.useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(null)
  const [isScrolled, setIsScrolled] = React.useState(false)

  const userIsSignedIn = () => {
    return !!Number(document.getElementById('current-user-id').getAttribute('content'))
  }
  const hidePremiumConfirmationModal = () => {
    setShouldShowPremiumConfirmationModal(false)
  };

  const hidePurchaseModal = () => {
    setShouldShowPurchaseModal(false)
    setSubscriptionType(null)
  };

  const showPremiumConfirmationModal = () => {
    setShouldShowPremiumConfirmationModal(true)
  };

  const showPurchaseModal = () => {
    setShouldShowPurchaseModal(true)
  };

  const updateSubscriptionStatus = subscription => {
    setSubscriptionStatus(subscription)
    setShouldShowPremiumConfirmationModal(true)
    setShouldShowPurchaseModal(false)
  };

  const renderPremiumConfirmationModal = () => {
    if (!shouldShowPremiumConfirmationModal) { return }
    return (
      <PremiumConfirmationModal
        hideModal={hidePremiumConfirmationModal}
        show={shouldShowPremiumConfirmationModal}
        subscription={subscriptionStatus}
      />
    )
  }

  const renderPurchaseModal = () => {
    if (!shouldShowPurchaseModal) { return }
    return (
      <PurchaseModal
        hideModal={hidePurchaseModal}
        lastFour={lastFour}
        show={showPurchaseModal}
        subscriptionType={subscriptionType}
        updateSubscriptionStatus={updateSubscriptionStatus}
      />
    )
  }

  return (
    <div>
      <div className="container premium-page">
        {userIsSignedIn() && <PremiumBannerBuilder originPage="premium" showPurchaseModal={showPurchaseModal} />}
        <div className="overview text-center">
          <PremiumPricingMinisRow diagnosticActivityCount={diagnosticActivityCount} independentPracticeActivityCount={independentPracticeActivityCount} lastFour={lastFour} lessonsActivityCount={lessonsActivityCount} showPurchaseModal={showPurchaseModal} userIsEligibleForNewSubscription={userIsEligibleForNewSubscription} />
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
      {renderPremiumConfirmationModal()}
      {renderPurchaseModal()}
    </div>
  )

}

export default PremiumPricingGuide
