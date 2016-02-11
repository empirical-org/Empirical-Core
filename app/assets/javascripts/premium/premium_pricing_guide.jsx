"use strict";
$(function() {
  var ele = $('#first-preview-section');
  if (ele.length > 0) {
    React.render(React.createElement(EC.PremiumPricingGuide), ele[0]);
  }
});

EC.PremiumPricingGuide = React.createClass({

  render: function(){
    return(
      <div className='container' id='premium-pricing-guide'>
        <div className='overview text-center'>
          <h1>Pricing Guide</h1>
          <p>Save time grading and gain actionable insights with Quill Premium.</p>
        </div>
          <EC.PremiumPricingMinisRow/>
          </div>
    )
  }
})
