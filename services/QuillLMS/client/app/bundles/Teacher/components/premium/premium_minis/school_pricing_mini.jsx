import React from 'react';

import IndividualFeaturesTable from './individual_features_table'

const SchoolPricingMini = ({ premiumFeatureData, }) => (
  <div className="pricing-mini">
    <section className="pricing-info">
      <h2>School and District Premium</h2>
      <div className="premium-rates">
        <h3>Let&#39;s talk</h3>
      </div>
      <div className="premium-button-container">
        <a className="quill-button outlined medium secondary focus-on-light" href="https://quill-partnerships.youcanbook.me">Schedule a demo</a>
        <a className="quill-button contained medium primary focus-on-light" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/">Request a quote</a>
      </div>
    </section>
    <IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="school" />
  </div>
);

export default SchoolPricingMini
