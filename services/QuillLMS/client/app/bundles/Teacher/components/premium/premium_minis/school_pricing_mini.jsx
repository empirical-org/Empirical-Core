import React from 'react';

import IndividualFeaturesTable from './individual_features_table';

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
        <a href="https://quill.org/request_quote" rel="noopener noreferrer" target="_blank">
          <button
            className="quill-button-archived contained medium primary focus-on-light book-call"
            type="button"
          >
            Book a call
          </button>
        </a>
        <button
          className="quill-button-archived contained medium primary focus-on-light"
          href="https://quill.org/request_quote"
          onClick={handleClickPurchasingOptions}
          type="button"
        >
          Purchasing options
        </button>
        <p>Request Quote or Buy Now</p>
      </div>
    </section>
    <IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="school" />
  </div>
);

export default SchoolPricingMini
