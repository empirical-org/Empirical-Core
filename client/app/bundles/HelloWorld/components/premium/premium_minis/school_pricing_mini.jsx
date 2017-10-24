import React from 'react'
import QuoteRequestModal from '../quote_request_modal.jsx'

export default React.createClass({

  getInitialState: function(){
    return {showModal: false}
  },

  hideModal() {
    this.setState({showModal: false});
  },

  showModal(){
    this.setState({showModal: true});
  },



  quoteRequestModal: function() {
      $(this.refs.quoteRequestModal).modal();
  },

  render: function(){
    return(
  <div className='pricing-mini'>
    <div className='promo-tab'>Get 50% off for the first year!</div>
    <div className='placeholder-div'>
      <div className='promo-tab'>Get 50% off for the first year!</div>
    </div>
    <header className='pricing-mini-header purple'>
      <div className='img-holder'>
          <img src={`${process.env.CDN_URL}/images/shared/school_premium_icon.png`} alt="teacher_premium_icon"/>
      </div>
      <h4>School Premium</h4>
    </header>
    <section className='pricing-info'>
      <div className='premium-rates'>
        <img className='red-line' src="/images/red-line-premium.svg" alt="red-line"/>
        <h3>
          <span className='four-fifty'>
            $450
          </span>
          <span>
            $900
          </span>
        </h3>
        <h4>per year</h4>
      </div>
      <ul>
        <li>Everything in Teacher Premium</li>
        <li>Dedicated representative to ensure a successful onboarding experience</li>
        <li>Professional Development Sessions</li>
        <li>Administrator dashboard for school-<br/>
          wide reports
        </li>
      </ul>
    </section>
    <button type='button' onClick={this.showModal} className='btn btn-default mini-btn purple'>Request Quote</button>
    <a href='https://quillpremium.youcanbook.me' target="_blank"><button type='button' className='btn btn-default mini-btn empty-purple'>Schedule Demo</button></a>
    <QuoteRequestModal show={this.state.showModal} hideModal={this.hideModal}/>
  </div>
);
  }
});
