import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx';
import TeacherPricingMini from './premium_minis/teacher_pricing_mini.jsx';
import SchoolPricingMini from './premium_minis/school_pricing_mini.jsx';
import React from 'react';

export default React.createClass({

  render() {
    return (
      <div className="row text-center">
        <div className="col-md-4">
          <BasicPricingMini />
        </div>
        <div className="col-md-4">
          <TeacherPricingMini {...this.props} />
        </div>
        <div className="col-md-4">
          <SchoolPricingMini {...this.props} />
        </div>
      </div>
    );
  },
});
