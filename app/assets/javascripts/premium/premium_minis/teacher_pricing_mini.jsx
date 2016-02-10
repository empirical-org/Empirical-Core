EC.TeacherPricingMini = React.createClass({

  render: function() {
    return (
      <div className='pricing-mini'>
        <header className='pricing-mini-header blue'>
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
          <div className='col-md-6'>
            <button type='button' className='btn btn-default mini-btn empty-blue'>Free Trial</button>
          </div>
          <div className='col-md-6'>
            <button type='button' className='btn btn-default mini-btn blue'>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
});
