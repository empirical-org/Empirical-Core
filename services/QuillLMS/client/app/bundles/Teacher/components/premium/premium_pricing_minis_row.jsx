import React from 'react';

import { premiumFeatures, } from './premium_features_data'
import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx';
import TeacherPricingMini from './premium_minis/teacher_pricing_mini.jsx';
import SchoolPricingMini from './premium_minis/school_pricing_mini.jsx';

export default class PremiumPricingMinisRow extends React.Component {
  state = {
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

  render() {
    const {
      diagnosticActivityCount,
      lessonsActivityCount,
      independentPracticeActivityCount,
      schoolBuyNowButton,
      showSchoolBuyNow,
      stripeSchoolPlan,
      stripeTeacherPlan,
      teacherBuyNowButton,
    } = this.props

    const { userIsSignedIn, isScrolled, } = this.state

    const premiumFeatureData = premiumFeatures({
      diagnosticActivityCount,
      lessonsActivityCount,
      independentPracticeActivityCount
    })

    return (
      <React.Fragment>
        <div className="choose-plan">
          <h2>Choose the plan that&apos;s right for you</h2>
          <p>As a nonprofit dedicated to helping students, Quill will always provide 100% of our activities for free.</p>
        </div>
        <div className="pricing-minis-container">
          <div className="pricing-minis">
            <BasicPricingMini
              premiumFeatureData={premiumFeatureData}
              userIsSignedIn={userIsSignedIn}
            />
            <TeacherPricingMini
              buyNowButton={teacherBuyNowButton}
              plan={stripeTeacherPlan.plan}
              premiumFeatureData={premiumFeatureData}
            />
            <SchoolPricingMini
              buyNowButton={schoolBuyNowButton}
              plan={stripeSchoolPlan.plan}
              premiumFeatureData={premiumFeatureData}
              showBadges={!isScrolled}
              showSchoolBuyNow={showSchoolBuyNow}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
