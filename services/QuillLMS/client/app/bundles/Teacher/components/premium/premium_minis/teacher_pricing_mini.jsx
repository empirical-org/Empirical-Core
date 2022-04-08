import React from 'react';

import IndividualFeaturesTable from './individual_features_table'

export default class TeacherPricingMini extends React.Component {
  render() {
    const { buyNowButton, premiumFeatureData, stripeTeacherPlan } = this.props
    const { plan } = stripeTeacherPlan

    return (
      <div className="pricing-mini">
        <section className="pricing-info">
          <h2>{plan.display_name}</h2>
          <div className="premium-rates">
            <h3>${plan.price_in_dollars}</h3>
            <p>Per teacher, per year</p>
          </div>
          <div className="premium-button-container">
            {buyNowButton()}
          </div>
        </section>

        <IndividualFeaturesTable
          premiumFeatureData={premiumFeatureData}
          type="teacher"
        />
      </div>
    );
  }
}
