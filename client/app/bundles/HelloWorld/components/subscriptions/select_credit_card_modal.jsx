import React from 'react';
import $ from 'jquery';

import UpdateEmail from '../shared/update_email.jsx';
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  render() {
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <h1 className="q-h2">Which credit card would you like to use to buy Teacher Premium?</h1>
          <button>Credit Card ending with {this.props.lastFour}</button>
          <button>Use a Different Card</button>
        </Modal.Body>
      </Modal>
    );
  },

});
