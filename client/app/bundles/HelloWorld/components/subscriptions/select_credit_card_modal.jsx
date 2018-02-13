import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  render() {
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="select-credit-card-modal" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <div className="pricing-info text-center">
            <h1>Quill Teacher Premium</h1>
            <span>$80 for one-year subscription</span>
          </div>
          <h2 className="q-h2">Which credit card would you like to pay with?</h2>
          <button className="extant-card">Credit Card ending with {this.props.lastFour}</button>
          <button>Use a Different Card</button>
        </Modal.Body>
      </Modal>
    );
  },
});
