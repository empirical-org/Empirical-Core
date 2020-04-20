import React from 'react';

export default class extends React.Component {
  render() {
    return (
      <div className="pricing-mini first">
        <header className="pricing-mini-header gray">
          <div className="img-holder basic">
            <img alt="Open book" className="open-book" src={`${process.env.CDN_URL}/images/shared/open-book.svg`} />
          </div>
        </header>
        <section className="pricing-info">
          <div className="premium-rates">
            <h3 className="bold">Basic</h3>
            <h3>Free forever</h3>
          </div>
          <a className='premium-button dark-green' href="/account/new" rel="noopener noreferrer" target="_blank">Get started</a>
          <ul className="text-left">
            <li>All five of our writing tools</li>
            <li>Our entire library of activities</li>
            <li>Basic student reporting</li>
            <li>Google and Clever Classroom integrations</li>
          </ul>
        </section>
      </div>
    );
  }
}
