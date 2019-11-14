import React from 'react';
import capitalize from 'underscore.string/capitalize';
import Modal from 'react-bootstrap/lib/Modal';

export default class extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal {...this.props} dialogClassName="school-premium-modal" onHide={this.props.hideModal} restoreFocus show={this.props.show}>
        <Modal.Body>
          <img alt="close-modal" className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} />
          <div className="pricing-info text-center">
            <div className="current-year">
              <h1>Quill School Premium</h1>
              <span>$900 for one-year subscription</span>
            </div>
            <span>Next Year's Rate is $1800</span>
          </div>
          <div className="cta-section">
            <h3>How would you like to renew your School’s <br />Premium subscription?</h3>
            <div className="flex-row space-between">
              <a className="q-button bg-quillgreen text-white" href="https://quillpremium.wufoo.com/forms/quill-premium-quote">Email Me a Quote</a>
              <button className="q-button bg-quillgreen text-white" onClick={this.props.purchaseSchoolPremium}>Pay with Credit Card</button>
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
        </Modal.Body>
      </Modal>
    );
  }
}
