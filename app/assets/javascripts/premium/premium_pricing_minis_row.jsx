EC.PremiumPricingMinisRow = React.createClass({

  render: function() {
    return (
      <div className='row text-center'>
        <div className='col-md-4'>
          <EC.BasicPricingMini/>
        </div>
        <div className='col-md-4'>
          <EC.TeacherPricingMini/>
        </div>
        <div className='col-md-4'>
          <EC.DistrictPricingMini/>
        </div>
      </div>
    )
  }
})
