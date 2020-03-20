import React from 'react';
import PremiumPricingMinisRow from '../components/premium/premium_pricing_minis_row.jsx';
import TeacherTestimonial from '../components/premium/teacher_testimonial.jsx';
import SubscriberLogos from '../components/premium/subscriber_logos.jsx';
import DistrictPricingBox from '../components/premium/district_pricing_box.jsx';
import PremiumFlyer from '../components/premium/premium_flyer';
import NotificationBox from '../components/shared/notification_box.jsx';

export default class extends React.Component {
  subscribers = () => {
    return (
    [{ source: '/images/subscribers/1_achievement.png', },
       { source: '/images/subscribers/2_kipp_sf.png', },
       { source: '/images/subscribers/3_kipp_dc.png', },
       { source: '/images/subscribers/4_kipp_la.png', },
       { source: '/images/subscribers/5_kipp_rocketship.png', },
       { source: '/images/subscribers/6_houston.png', },
       { source: '/images/subscribers/7_desmoines.png', },
       { source: '/images/subscribers/8_richmond.png', },
       { source: '/images/subscribers/9_putnam.png', },
       { source: '/images/subscribers/10_elizabeth.png', },
       { source: '/images/subscribers/11_thurston.png', },
       { source: '/images/subscribers/12_lead.png', },
       { source: '/images/subscribers/13_trinity.png', },
       { source: '/images/subscribers/14_kuemper.png', },
       { source: '/images/subscribers/15_jodan.png', },
       { source: '/images/subscribers/16_princeton.png', }]
    );
  };

  render() {
    return (
      <div className="container" id="premium-pricing-guide">
        <div className="overview text-center">
          <h1>Pricing Guide</h1>
          <p>We’re here to support anyone impacted by school closures by providing every single teacher with free Premium.</p>
        </div>
        <PremiumPricingMinisRow {...this.props} />
        <DistrictPricingBox />
        <PremiumFlyer />
        <TeacherTestimonial />
        <SubscriberLogos subscribers={this.subscribers()} />
        <p className="logo-tag">Trusted by some of the best schools in the country.</p>
      </div>

    );
  }
}
