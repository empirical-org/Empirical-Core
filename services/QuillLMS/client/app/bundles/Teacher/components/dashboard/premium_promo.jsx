import React from 'react';

import Stripe from '../modules/stripe/charge.js';

export default class PremiumPromo extends React.Component {

  charge() {
    new Stripe();
  }

  freeMonths() {
    const d = new Date();
    return 5 - d.getMonth();
  }

  miniBuilder() {
    /* eslint-disable react/jsx-no-target-blank */
    const supportLink = <a className="q-button text-white" href="https://support.quill.org/quill-premium" target="_blank">Learn More About Premium</a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="mini_content premium-promo">
        <div className="gray-underline" style={{ position: 'relative', }}>
          <h3>Get Quill Premium Now</h3>
        </div>
        <p>
          Upgrade now and cover all of the students in your classes or school.
        </p>
        {supportLink}
      </div>
    );
  }

  render() {
    return (
      <div className='mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'>
        {this.miniBuilder()}
      </div>
    );
  }
}
