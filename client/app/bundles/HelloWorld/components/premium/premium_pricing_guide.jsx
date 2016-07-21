"use strict";

import React from 'react'
import PremiumPricingMinisRow from './premium_pricing_minis_row.jsx'
import TeacherTestimonial from './teacher_testimonial.jsx'
import SubscriberLogos from './subscriber_logos.jsx'

export default React.createClass({

  subscribers: function() {
    return (
      [{source: '/images/subscribers/1_achievement.png'},
       {source: '/images/subscribers/2_kipp_sf.png'},
       {source: '/images/subscribers/3_kipp_dc.png'},
       {source: '/images/subscribers/4_kipp_la.png'},
       {source: '/images/subscribers/5_kipp_rocketship.png'},
       {source: '/images/subscribers/6_houston.png'},
       {source: '/images/subscribers/7_desmoines.png'},
       {source: '/images/subscribers/8_richmond.png'},
       {source: '/images/subscribers/9_putnam.png'},
       {source: '/images/subscribers/10_elizabeth.png'},
       {source: '/images/subscribers/11_thurston.png'},
       {source: '/images/subscribers/12_lead.png'},
       {source: '/images/subscribers/13_trinity.png'},
       {source: '/images/subscribers/14_kuemper.png'},
       {source: '/images/subscribers/15_jodan.png'},
       {source: '/images/subscribers/16_princeton.png'}]
     );
  },

  render: function(){
    return(
      <div className='container' id='premium-pricing-guide'>
        <div className='overview text-center'>
          <h1>Pricing Guide</h1>
          <p>Save time grading and gain<br/>actionable insights with Quill Premium.</p>
        </div>
          <PremiumPricingMinisRow/>
          <TeacherTestimonial/>
          <SubscriberLogos subscribers={this.subscribers()}/>
          <p className='logo-tag'>Trusted by some of the best schools in the country.</p>
          </div>
    )
  }
})
