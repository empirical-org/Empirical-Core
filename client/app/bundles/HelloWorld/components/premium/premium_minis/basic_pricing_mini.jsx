import React from 'react'
export default React.createClass({

  render: function() {
    return (
      <div className='pricing-mini'>
        <header className='pricing-mini-header green'>
          <div className='img-holder basic'>
            <img src="/images/basic_icon.png" alt="basic_icon"/>
          </div>
          <h4>Basic</h4>
        </header>
        <section className='pricing-info'>
          <div className='premium-rates'>
          <h3>Free</h3>
          <h4>forever</h4>
          </div>
          <ul className='text-left'>
            <li>All of our writing apps</li>
            <li>Our entire library of activities</li>
            <li>Basic student reporting</li>
            <li>Sign on with Clever or Google</li>
          </ul>
        </section>
        <a href='/account/new'><button type='button' className='btn btn-default mini-btn green'>Sign Up</button></a>
      </div>
    );
  }
});
