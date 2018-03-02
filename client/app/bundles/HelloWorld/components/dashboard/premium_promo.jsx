import React from 'react';
import Stripe from '../modules/stripe/charge.js';

export default React.createClass({

  charge() {
    new Stripe();
  },

  freeMonths() {
    const d = new Date();
    return 5 - d.getMonth();
  },

  miniBuilder() {
    return (
      <div className="mini_content premium-promo">
        <div className="gray-underline" style={{ position: 'relative', }}>
          <h3>Get Quill Premium Now</h3>
        </div>
        <p>
          Upgrade now and cover all of the students in your classes or school.
        </p>
        <div className="flex-row space-around">
          <div className="pricing">
            <h2>$80</h2>
            <span>per teacher</span>
          </div>
          <div className="fake-border" />
          <div className="pricing">
            <h2>$900*</h2>
            <span>per school</span>
            <br />
            <span className="special-price">*special price</span>
          </div>
        </div>
        <a href="https://support.quill.org/quill-premium" target="_blank" className="q-button text-white">Learn More About Premium</a>
      </div>
    );
  },

  render() {
    return (
      <div className={'mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'}>
        {this.miniBuilder()}
      </div>
    );
  },
});
