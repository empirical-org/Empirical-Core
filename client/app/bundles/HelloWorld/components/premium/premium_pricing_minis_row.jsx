import BasicPricingMini from './premium_minis/basic_pricing_mini.jsx'
import TeacherPricingMini from './premium_minis/district_pricing_mini.jsx'
import DistrictPricingMini from './premium_minis/teacher_pricing_mini.jsx'
import React from 'react'

export default React.createClass({

  render: function() {
    return (
      <div className='row text-center'>
        <div className='col-md-4'>
          <BasicPricingMini/>
        </div>
        <div className='col-md-4'>
          <TeacherPricingMini/>
        </div>
        <div className='col-md-4'>
          <DistrictPricingMini/>
        </div>
      </div>
    )
  }
})
