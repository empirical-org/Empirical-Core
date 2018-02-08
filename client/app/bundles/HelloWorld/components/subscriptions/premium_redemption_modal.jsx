import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  render() {
    return (
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName="" restoreFocus>
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
        </Modal.Body>
      </Modal>
    );
  },

});
