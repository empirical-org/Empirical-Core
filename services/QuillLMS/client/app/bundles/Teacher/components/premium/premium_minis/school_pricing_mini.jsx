import React from 'react';

const SchoolPricingMini = () => (
  <div className="pricing-mini">
    <header className="pricing-mini-header blue">
      <div className="img-holder">
        <img alt="School" className="blue-school" src={`${process.env.CDN_URL}/images/shared/blue-school.svg`} />
      </div>
    </header>
    <section className="pricing-info">
      <h2>School Premium</h2>
      <div className="premium-rates">
        <h3 className="school-premium-rate">Price upon request</h3>
      </div>
      <div className="premium-button-container">
        <a className="quill-button contained medium primary" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/">Contact us</a>
        <a className="quill-button outlined medium secondary" href="https://quill-partnerships.youcanbook.me">Schedule demo</a>
      </div>
      <ul>
        <li className="semibold">Everything in Teacher Premium</li>
        <li>Dedicated representative to ensure successful implementation</li>
        <li>Professional development sessions</li>
        <li>Administrator dashboard for school-wide reports</li>
      </ul>
    </section>
    <section className="learn-more">
      <a href="#school-premium">Learn more</a>
    </section>
  </div>
);

export default SchoolPricingMini
