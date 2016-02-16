EC.TeacherPricingMini = React.createClass({

  // TODO: make route for free trial that depends on if they are signed in or not, add stripe integration to free trial

  charge: function() {
    new EC.modules.Stripe()
  },

  render: function() {
    return (
      <div className='pricing-mini'>
        <header className='pricing-mini-header blue'>
          <div className='img-holder'>
            <img src="/images/teacher_premium_icon.png" alt="teacher_premium_icon"/>
          </div>

          <h4>Teacher Premium</h4>
        </header>
        <section className='pricing-info'>
          <div className='premium-rates'>
            <h3>$80</h3>
            <h4>per year</h4>
          </div>
          <ul className='text-left'>
            <li>Everything in Basic</li>
            <li>Unlimited students in each class</li>
            <li>Student reports on Common Core Standards</li>
            <li>Download and print reports</li>
          </ul>
        </section>
        <div className='row'>
            <button type='button' className='btn btn-default mini-btn empty-blue'>Free Trial</button>
            <button type='button' id='purchase-btn' onClick={this.charge} className='btn btn-default mini-btn blue'>Buy Now</button>
        </div>
      </div>
    );
  }
});
