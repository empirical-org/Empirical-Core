import React from 'react'
import $ from 'jquery'

import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  
    render: function() {
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal'>
                <Modal.Body>
                  <h1>CODE ME LIKE THE PAGES IN AMR'S PICTURES</h1>
                </Modal.Body>
            </Modal>
        )
    }

})
