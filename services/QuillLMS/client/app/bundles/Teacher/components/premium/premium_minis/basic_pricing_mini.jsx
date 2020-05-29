import React from 'react';

const getStartedButton = (userIsSignedIn) => {
  if (userIsSignedIn) { return }

  return <a className='quill-button medium primary contained' href="/account/new">Get started</a>
}

const BasicPricingMini = ({ userIsSignedIn, }) => (
  <div className="pricing-mini first">
    <header className="pricing-mini-header gray">
      <div className="img-holder basic">
        <img alt="Open book" className="open-book" src={`${process.env.CDN_URL}/images/shared/open-book.svg`} />
      </div>
    </header>
    <section className="pricing-info">
      <h2>Basic</h2>
      <div className="premium-rates">
        <h3>$0</h3>
        <h4>Per month</h4>
      </div>
      <div className="premium-button-container">
        {getStartedButton(userIsSignedIn)}
      </div>
      <ul className="text-left">
        <li>All five of our writing tools</li>
        <li>Our entire library of activities</li>
        <li>Basic student reporting</li>
        <li>Clever and Google Classroom integrations</li>
      </ul>
    </section>
  </div>
);

export default BasicPricingMini
