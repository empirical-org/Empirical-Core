import React from 'react'
import Stripe from '../../modules/stripe.jsx'
export default React.createClass({

  charge: function() {
      new Stripe(40000, '$400 School Premium');
  },

  render: function(){
    return(
  <div className='pricing-mini'>
    <header className='pricing-mini-header purple'>
      <div className='img-holder'>
          <img src="/images/school_premium_icon.png" alt="teacher_premium_icon"/>
      </div>
      <h4>School & District Premium</h4>
    </header>
    <section className='pricing-info'>
      <div className='premium-rates'>
        <h3>$400</h3>
        <h4>per school per year</h4>
        <h4>discounts available for multiple schools</h4>
      </div>
      <ul>
        <li>Everything in Teacher Premium</li>
        <li>Professional development sessions</li>
        <li>Batch rostering students</li>
        <li>Administrator dashboard for school-<br/>
          wide and district-wide information
        </li>
      </ul>
    </section>
    <button type='button' id='purchase-btn' data-toggle="modal" onClick={this.charge} className='btn btn-default mini-btn purple'>Buy Now</button>
    <a href='https://quillpremium.wufoo.com/forms/quill-premium-quote'><button type='button' className='btn btn-default mini-btn empty-purple'>Learn More</button></a>
  </div>
);
  }
});
