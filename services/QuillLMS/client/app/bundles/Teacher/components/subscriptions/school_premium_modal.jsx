import React from 'react';

export default function SchoolPremiumModal({ hideModal, purchaseSchoolPremium, show }) {
  if(!show) {
    return <span />
  }
  return(
    <div className="school-premium-modal">
      <div className="modal-background" />
      <div className="modal-content">
        <button className="interactive-wrapper focus-on-light close-modal-button" onClick={hideModal} type="button"><img alt="close-modal" src={`${process.env.CDN_URL}/images/shared/close_x.svg`} /></button>
        <div className="pricing-info text-center">
          <div className="current-year">
            <h1>Quill School Premium</h1>
            <span>$900 for one-year subscription</span>
          </div>
          <span>Next Year’s Rate is $1800</span>
        </div>
        <div className="cta-section">
          <h3>How would you like to renew your School’s <br />Premium subscription?</h3>
          <div className="flex-row space-between">
            <a className="q-button bg-quillgreen text-white" href="https://quillpremium.wufoo.com/forms/quill-premium-quote">Email Me a Quote</a>
            <button className="q-button bg-quillgreen text-white" onClick={purchaseSchoolPremium} type="submit">Pay with Credit Card</button>
          </div>
        </div>
        <div className="not-the-purchaser-section">
          <h3>Not the Purchaser?</h3>
          <div className="flex-row space-between">
            <i className="fas fa-credit-card" />
            <p>
              <span>Credit Card Purchaser:</span>
              Reach out to your school purchaser and ask them to login to Quill and renew the subscription.
            </p>
          </div>
          <div className="flex-row space-between">
            <i className="fas fa-file" />
            <p>
              <span>Quote Purchaser:</span>
            Click on <i>Email Me a Quote</i> and forward the quote to your school’s purchaser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
