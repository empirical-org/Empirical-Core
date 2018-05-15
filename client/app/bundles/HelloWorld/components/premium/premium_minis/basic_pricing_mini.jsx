import React from 'react';

export default React.createClass({

  render() {
    let signupButtonOrNothing;
    if (Number(document.getElementById('current-user-id').getAttribute('content'))) {
      // then the user is logged in and we should not show sign up
      signupButtonOrNothing = null;
    } else {
      signupButtonOrNothing = <a href="/account/new"><button type="button" className="btn btn-default mini-btn green">Sign Up</button></a>;
    }
    return (
      <div className="pricing-mini first">
        <header className="pricing-mini-header green">
          <div className="img-holder basic">
            <img src={`${process.env.CDN_URL}/images/shared/basic_icon.png`} alt="basic_icon" />
          </div>
          <h4>Basic</h4>
        </header>
        <section className="pricing-info">
          <div className="premium-rates">
            <h3>Free</h3>
            <h4>forever</h4>
          </div>
          <ul className="text-left">
            <li>All five of our writing tools</li>
            <li>Our entire library of activities</li>
            <li>Basic student reporting</li>
            <li>Google and Clever Classroom integrations</li>
          </ul>
        </section>
        {signupButtonOrNothing}
      </div>
    );
  },
});
