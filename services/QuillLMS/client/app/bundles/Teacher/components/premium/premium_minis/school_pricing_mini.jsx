import React from 'react';

import IndividualFeaturesTable from './individual_features_table'

const greenCheckSrc = `${process.env.CDN_URL}/images/icons/icons-check-green.svg`

const SchoolPricingMini = ({ plan, premiumFeatureData, showBadges, handleClickPurchasingOptions, }) => (

  <div className="pricing-mini">
    <section className="pricing-info">
      <h2>School and District Premium</h2>
      <div className="premium-rates">
        <h3>${plan.price_in_dollars}</h3>
        <p>Per school, per year</p>
      </div>
      <div className="premium-button-container">
        <button
          className="quill-button contained medium primary focus-on-light"
          onClick={handleClickPurchasingOptions}
          type="button"
        >
          Purchasing options
        </button>
        <p>Request Quote or Buy Now</p>
      </div>
      {showBadges && <div className="school-premium-badge-container">
        <div className="school-premium-badge"><img alt="Check icon" src={greenCheckSrc} /> 2 PD sessions</div>
        <div className="school-premium-badge"><img alt="Check icon" src={greenCheckSrc} /> 3 coaching sessions</div>
        <div className="school-premium-badge"><img alt="Check icon" src={greenCheckSrc} /> Custom reports</div>
      </div>}
    </section>
    <IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="school" />
  </div>
);

export default SchoolPricingMini
