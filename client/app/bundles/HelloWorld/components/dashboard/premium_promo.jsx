'use strict'

 import React from 'react'
 import Stripe from '../modules/stripe.jsx'

 export default React.createClass({

   charge: function() {
       new Stripe();
   },

  miniBuilder: function() {
    return (
      <div className="mini_content premium-promo">
        <div className="gray-underline" style={{position: 'relative'}}>
          <h3>Buy Premium Now, Get the Rest of the School Year Free</h3>
        </div>
        <p>
          Buy Quill Premium before July 1, 2017, and we'll extend your subscription until August 31, 2018 at no extra cost.
        </p>
        <div className='flex-row space-around'>
          <button onClick={this.charge} className="q-button button-white text-qgreen inline">Buy Now</button>
          <a href='../../premium' className="q-button button-white inline">Learn More</a>
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container results-overview-mini-container col-md-4 col-sm-5 text-center"}>
        {this.miniBuilder()}
      </div>
    );
  }
});
