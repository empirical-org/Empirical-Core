import React from 'react';

import QuestionsAndAnswers from './QuestionsAndAnswers.tsx'

import PremiumBannerBuilder from '../components/scorebook/premium_banners/premium_banner_builder.jsx'
import PremiumPricingMinisRow from '../components/premium/premium_pricing_minis_row.jsx';
import PremiumFeaturesTable from '../components/premium/premium_features_table.tsx'
import SubscriberLogos from '../components/premium/subscriber_logos.jsx';
import SchoolPremium from '../components/premium/school_premium.jsx';
import StripeSubscriptionCheckoutSessionButton from '../components/shared/StripeSubscriptionCheckoutSessionButton';

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

const SchoolAndDistrictPremiumModal = ({ stripeSchoolPlan, associatedSchools, userIsSignedIn, renderSchoolBuyNowButton, startAtStageTwo, }) => {
  let schoolBuyNowButton = <a className="quill-button contained medium primary focus-on-light" href="/session/new?redirect=/premium?school_purchase_stage_two=true">Buy Now</a>

  if (associatedSchools.length === 1) {
    const schoolIds = associatedSchools.map(s => s.id)
    schoolBuyNowButton = renderSchoolBuyNowButton(schoolIds)
  }

  if (!userIsSignedIn) {
    schoolBuyNowButton = <a className="quill-button contained medium primary focus-on-light" href="/session/new?redirect=/premium?school_purchase_stage_two=true">Buy Now</a>
  }

  const requestAQuoteButton = <a className="quill-button outlined medium secondary focus-on-light" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/">Request a Quote</a>

  return (
    <div className="modal-container school-and-district-premium-modal-container">
      <div className="modal-background" />
      <div className="school-and-district-premium-modal quill-modal modal-body">
        <div className="school-and-district-premium-column pricing-info">
          <h2>Buy School Premium Now</h2>
          <div className="premium-rates">
            <h3>${stripeSchoolPlan.plan.price_in_dollars}</h3>
            <p>Per school, per year</p>
            <p>Purchase a school subscription now with a credit card.</p>
          </div>
          {schoolBuyNowButton}

        </div>
        <div className="school-and-district-premium-column pricing-info">
          <h2>Request a School Premium Quote</h2>
          <div className="premium-rates">
            <h3>${stripeSchoolPlan.plan.price_in_dollars}</h3>
            <p>Per school, per year</p>
            <p>Complete the quote request form to receive a quote via email.</p>
          </div>
          {requestAQuoteButton}
        </div>
        <div className="school-and-district-premium-column pricing-info">
          <h2>Contact Us for District Premium</h2>
          <div className="premium-rates">
            <h3>Custom</h3>
            <p>Per school, per year</p>
            <p>Quill provides discounts for multi-school subscriptions.</p>
          </div>
          {requestAQuoteButton}
        </div>
      </div>
    </div>
  )
}

export const PremiumPricingGuide = ({
  customerEmail,
  diagnosticActivityCount,
  independentPracticeActivityCount,
  lessonsActivityCount,
  associatedSchools,
  showSchoolBuyNow,
  stripeSchoolPlan,
  stripeTeacherPlan,
  userIsEligibleForNewSubscription,
}) => {
  const [showSchoolAndDistrictPremiumModal, setShowSchoolAndDistrictPremiumModal] = React.useState(false)

  const userIsSignedIn = () => {
    return !!Number(document.getElementById('current-user-id').getAttribute('content'))
  }

  function handleShowSchoolAndDistrictPremiumModal() { setShowSchoolAndDistrictPremiumModal(true) }

  const schoolBuyNowButton = (schoolIds) => {
    return (
      <StripeSubscriptionCheckoutSessionButton
        buttonClassName="quill-button contained medium primary focus-on-light"
        buttonId="purchase-btn"
        buttonText='Buy Now'
        cancelPath='premium'
        customerEmail={customerEmail}
        schoolIds={schoolIds}
        stripePriceId={stripeSchoolPlan.plan.stripe_price_id}
        userIsEligibleForNewSubscription={userIsEligibleForNewSubscription}
        userIsSignedIn={userIsSignedIn}
      />
    )
  }

  const teacherBuyNowButton = () => {
    return (
      <StripeSubscriptionCheckoutSessionButton
        buttonClassName="quill-button contained medium primary focus-on-light"
        buttonId="purchase-btn"
        buttonText='Buy Now'
        cancelPath='premium'
        customerEmail={customerEmail}
        stripePriceId={stripeTeacherPlan.plan.stripe_price_id}
        userIsEligibleForNewSubscription={userIsEligibleForNewSubscription}
        userIsSignedIn={userIsSignedIn()}
      />
    )
  }

  const upgradeToPremiumNowButton = () => {
    return (
      <StripeSubscriptionCheckoutSessionButton
        buttonClassName='btn-orange'
        buttonText='Upgrade to Premium Now'
        cancelPath='premium'
        customerEmail={customerEmail}
        stripePriceId={stripeTeacherPlan.plan.stripe_price_id}
        userIsEligibleForNewSubscription={userIsEligibleForNewSubscription}
        userIsSignedIn={userIsSignedIn()}
      />
    )
  }

  return (
    <div>
      <div className="container premium-page">
        {userIsSignedIn() && <PremiumBannerBuilder originPage="premium" upgradeToPremiumNowButton={upgradeToPremiumNowButton} />}
        {showSchoolAndDistrictPremiumModal && (
          <SchoolAndDistrictPremiumModal
            associatedSchools={associatedSchools}
            renderSchoolBuyNowButton={schoolBuyNowButton}
            stripeSchoolPlan={stripeSchoolPlan}
            userIsSignedIn={userIsSignedIn()}
          />
        )}
        <div className="overview text-center">
          <PremiumPricingMinisRow
            diagnosticActivityCount={diagnosticActivityCount}
            independentPracticeActivityCount={independentPracticeActivityCount}
            lessonsActivityCount={lessonsActivityCount}
            onClickPurchasingOptions={handleShowSchoolAndDistrictPremiumModal}
            stripeSchoolPlan={stripeSchoolPlan}
            stripeTeacherPlan={stripeTeacherPlan}
            teacherBuyNowButton={teacherBuyNowButton}
            userIsEligibleForNewSubscription={userIsEligibleForNewSubscription}
          />

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
    </div>
  )
}

export default PremiumPricingGuide
