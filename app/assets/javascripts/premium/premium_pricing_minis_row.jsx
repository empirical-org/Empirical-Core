EC.PremiumPricingMinisRow = React.createClass({

  render: function() {
    return (
      <div className='row'>
        <div className='col-md-4 col-sm-6'>
          <EC.BasicPricingMini/>
        </div>
        <div className='col-md-4 col-sm-6'>
          <EC.TeacherPricingMini/>
        </div>
        <div className='col-md-4 col-sm-6'>
          <EC.DistrictPricingMini/>
        </div>
      </div>
    )
  }
})
