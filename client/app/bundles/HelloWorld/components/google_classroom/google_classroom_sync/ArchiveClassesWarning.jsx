import React from 'react'
import $ from 'jquery'
import pluralize from 'pluralize'

import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({

    render: function() {
      let archivedCount;
      if (this.props.data && this.props.data.archivedCount) {
       archivedCount = this.props.data.archivedCount;
     } else {
       archivedCount = 0;
     }
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal archive-warning' restoreFocus={true}>
              <Modal.Body>
                  <img className='pull-right react-bootstrap-close' onClick={this.props.hideModal} src='/images/close_x.svg' alt='close-modal'/>
                  <h1 className='q-h2'><i className="fa fa-exclamation-triangle"></i>Warning: Archiving Classroom</h1>
                  <h3 className='subheader'>You are archiving <strong>{`${archivedCount} ${pluralize('classroom', archivedCount)}.`}</strong></h3>
                  <p>
                    When a classroom is deselected, Quill will archive the classroom and it will no longer sync that classroom with Google Classroom. If you would like to use the classroom, please go back and select it
                  </p>
                  <div className="button-wrapper">
                    <button className="q-button cta-button bg-white text-black close-modal" onClick={this.props.hideModal}>
                      Back
                    </button>
                    <button className="q-button cta-button bg-quillgreen text-white sync-classrooms" onClick={this.props.syncClassroomsAjax}>
                      Sync Classrooms
                    </button>
                  </div>
              </Modal.Body>
            </Modal>
        )
    }

})
