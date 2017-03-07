
'use strict'

 import React from 'react'
 import Stripe from '../modules/stripe.jsx'

 export default React.createClass({

   charge: function() {
       new Stripe();
   },

   freeMonths: function(){
     const d = new Date()
     return 5 - d.getMonth()
   },

  miniBuilder: function() {
    return (
      <div className="mini_content premium-promo">
        <div className="gray-underline" style={{position: 'relative'}}>
          <h3>Premium Bonus: <strong>{this.freeMonths()} Months Free</strong></h3>
        </div>
        <p>
          Upgrade now for next school year and get the rest of this year for free.
        </p>
        <div className='flex-row space-around'>
          <div className='pricing'>
            <h2>$80</h2>
            <span>per teacher</span>
          </div>
          <div className="fake-border"></div>
          <div className='pricing'>
            <h2>$450*</h2>
            <span>per school</span>
            <br/>
            <span className='special-price'>*special price</span>
          </div>
        </div>
         <a href='/premium' className="q-button text-white">Learn More About Premium</a>
      </div>
    );
  },

  // <button onClick={this.charge} className="q-button button-white text-qgreen inline">Buy Now</button>
  // <a href='../../premium' className="q-button button-white inline">Learn More</a>

  render: function() {
    return (
      <div className={"mini_container results-overview-mini-container col-md-4 col-sm-5 text-center"}>
        {this.miniBuilder()}
      </div>
    );
  }
});
