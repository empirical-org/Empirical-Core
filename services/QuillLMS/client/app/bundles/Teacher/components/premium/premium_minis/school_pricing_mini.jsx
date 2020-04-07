import React from 'react';
import QuoteRequestModal from '../quote_request_modal.jsx';

const SchoolPricingMini = ({
  showPurchaseModal,
  userBelongsToSchoolThatHasPaid,
  userIsSignedIn,
  userHasSchool,
  userIsEligibleForNewSubscription,
}) => {
  let onClickEvent = showPurchaseModal;
  let savingsCopy = 'Get 50% off for the first year!';
  if (userBelongsToSchoolThatHasPaid) {
    savingsCopy = 'Renew Now And Receive 50% Off!';
  }
  if (!userIsSignedIn) {
    onClickEvent = () => alert('You must be logged in to activate Premium.');
  } else if (!userHasSchool) {
    onClickEvent = () => alert('You must add a school before buying School Premium. You can do so by visiting Quill.org/teachers/my_account');
  } else if (!userIsEligibleForNewSubscription) {
    onClickEvent = () => alert('You have an active subscription and cannot buy premium now. You may buy a new Premium subscription when your current subscription expires.');
  }
  return (
    <div className="pricing-mini">
      <header className="pricing-mini-header blue">
        <div className="img-holder">
          <img alt="School" className="blue-school" src={`${process.env.CDN_URL}/images/shared/blue-school.svg`} />
        </div>
      </header>
      <section className="pricing-info">
        <div className="premium-rates">
          <h3 className="bold">School Premium</h3>
          <h3 className="strikethrough">$1,800 per year</h3>
          <h4>Free for the rest of the 2019/2020 school year</h4>
        </div>
        <a className='premium-button dark-green' href='https://forms.gle/ePA3C866hfKkN6BRA' rel="noopener noreferrer" target="_blank">Request free access</a>
        <ul>
          <li className="semibold">Everything in Teacher Premium</li>
          <li>Dedicated representative to ensure successful implementation</li>
          <li>Professional development sessions</li>
          <li>Administrator dashboard for school-wide reports</li>
        </ul>
      </section>
      <section className="learn-more">
        <a href="#school-premium">Learn more</a>
      </section>
    </div>
  );
}

export default SchoolPricingMini
