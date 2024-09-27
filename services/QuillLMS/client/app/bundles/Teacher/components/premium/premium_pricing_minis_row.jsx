import React from 'react';

import { premiumFeatures, } from './premium_features_data';
import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx';
import SchoolPricingMini from './premium_minis/school_pricing_mini.jsx';
import TeacherPricingMini from './premium_minis/teacher_pricing_mini.jsx';

const MOBILE_WIDTH = 991
const VERTICAL_INTERSECTION_OF_PREMIUM_PRICING_ROW_AND_TABLE = 337

export default class PremiumPricingMinisRow extends React.Component {
  state = {
    subscriptionType: null,
    subscriptionStatus: null,
    userIsSignedIn: !!Number(document.getElementById('current-user-id').getAttribute('content'))
  };

  render() {
    const {
      diagnosticActivityCount,
      lessonsActivityCount,
      independentPracticeActivityCount,
      stripeSchoolPlan,
      stripeTeacherPlan,
      teacherBuyNowButton,
      onClickPurchasingOptions,
    } = this.props

    const { userIsSignedIn } = this.state

    const premiumFeatureData = premiumFeatures({
      diagnosticActivityCount,
      lessonsActivityCount,
      independentPracticeActivityCount
    })

    return (
      <React.Fragment>
        <div className="sticky-header">
          <div className="sticky-header-background-container">
            <div className="choose-plan">
              <h2>Go Premium to improve student writing</h2>
              <div className="premium-description">
                <p>As a nonprofit, Quill provides all activities for free, forever.</p>
                <p>Quill Premium provides schools and districts with:</p>
                <ul>
                  <li>Advanced reporting</li>
                  <li>Professional learning</li>
                  <li>Priority tech support</li>
                </ul>
              </div>
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
                  handleClickPurchasingOptions={onClickPurchasingOptions}
                  plan={stripeSchoolPlan.plan}
                  premiumFeatureData={premiumFeatureData}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
