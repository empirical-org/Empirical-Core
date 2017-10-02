import React from 'react'
import $ from 'jquery'
import pluralize from 'pluralize'

import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
    render: function() {
      let syncedCount;
      if (this.props.data && this.props.data.selectedClassrooms) {
       syncedCount = this.props.data.selectedClassrooms.length;
     } else {
       syncedCount = 0;
     }
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal sync-success' restoreFocus={true}>
              <Modal.Body>
                  <img className='pull-right react-bootstrap-close' onClick={this.props.hideModal} src='/images/close_x.svg' alt='close-modal'/>
                  <h1 className='q-h2'><i className="fa fa-check" aria-hidden="true"></i>Great! You've synced {`${syncedCount} ${pluralize('class', syncedCount)}`}</h1>
                  <h3 className='subheader'>It may take up to <strong>5 minutes</strong> to import your students.</h3>
                  <p>
                    Please have your students log in using their Google accounts. If you have any questions, you can check <a href='www.support.quill.org'>support.quill.org</a>
                  </p>
                    <a className="q-button cta-button bg-quillgreen text-white back-to-profile" href='/'>
                      Got It!
                    </a>
              </Modal.Body>
            </Modal>
        )
    }

})
