import React from 'react';
import QuoteRequestModal from '../quote_request_modal.jsx';

export default React.createClass({

  render() {
    let onClickEvent = this.props.showPurchaseModal;
    let savingsCopy = 'Get 50% off for the first year!';
    if (this.props.userBelongsToSchoolThatHasPaid) {
      savingsCopy = 'Renew Now And Receive 50% Off!';
    }
    if (!this.props.userIsSignedIn) {
      onClickEvent = () => alert('You must be logged in to activate Premium.');
    } else if (!this.props.userHasSchool) {
      onClickEvent = () => alert('You must add a school before buying School Premium. You can do so by visiting Quill.org/teachers/my_account');
    } else if (!this.props.userIsEligibleForNewSubscription) {
      onClickEvent = () => alert('You have an active subscription and cannot buy premium now. You may buy a new Premium subscription when your current subscription expires.');
    }
    return (
      <div className="pricing-mini">
        <div className="promo-tab">{savingsCopy}</div>
        <div className="placeholder-div">
          <div className="promo-tab">{savingsCopy}</div>
        </div>
        <header className="pricing-mini-header purple">
          <div className="img-holder">
            <img src={`${process.env.CDN_URL}/images/shared/school_premium_icon.png`} alt="teacher_premium_icon" />
          </div>
          <h4>School Premium</h4>
        </header>
        <section className="pricing-info">
          <div className="premium-rates">
            <img className="red-line" src="/images/red-line-premium.svg" alt="red-line" />
            <h3>
              <span className="four-fifty">
            $900
          </span>
              <span>
            $1800
          </span>
            </h3>
            <h4>per year</h4>
          </div>
          <ul>
            <li>Everything in Teacher Premium</li>
            <li>Dedicated representative to ensure a successful onboarding experience</li>
            <li>Professional Development Sessions</li>
            <li>Administrator dashboard for school-<br />
          wide reports
        </li>
          </ul>
        </section>
        <button type="button" onClick={onClickEvent} className="btn btn-default mini-btn purple">Purchase</button>
        <a href="https://quillpdemo.youcanbook.me/" target="_blank"><button type="button" className="btn btn-default mini-btn empty-purple">Schedule Demo</button></a>
      </div>
    );
  },
});
