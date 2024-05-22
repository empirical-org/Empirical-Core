import React from 'react';

import IndividualFeaturesTable from './individual_features_table';

const getStartedButton = (userIsSignedIn) => {
  if (userIsSignedIn) { return }

  return <a className='quill-button medium secondary outlined focus-on-light' href="/account/new">Get started</a>
}

const BasicPricingMini = ({ userIsSignedIn, premiumFeatureData, }) => (
  <div className="pricing-mini first">
    <section className="pricing-info">
      <h2>Basic</h2>
      <div className="premium-rates">
        <h3>$0</h3>
        <p>Free forever</p>
      </div>
      <div className="premium-button-container">
        {getStartedButton(userIsSignedIn)}
      </div>
    </section>
    <IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="basic" />
  </div>
);

export default BasicPricingMini
