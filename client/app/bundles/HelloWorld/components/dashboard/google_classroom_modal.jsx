import React from 'react'
import $ from 'jquery'

import UpdateEmail from '../shared/update_email.jsx'
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
    render: function() {
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal' restoreFocus>
                <Modal.Body>
                    <img className='pull-right react-bootstrap-close' onClick={this.props.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt='close-modal'/>
                    <h1 className='q-h2'>First: Update Your Email</h1>
                    <p>Your Quill email address must be the same as your Google Classroom email. If your email is the same click Next. If it is different, you can update your Quill email below.</p>
                    <UpdateEmail email={this.props.user.email}/>
                    <a className="q-button cta-button bg-quillgreen text-white" href='/auth/google_oauth2'>
                      Next: Choose Google Classrooms
                    </a>
                </Modal.Body>
            </Modal>
        )
    }

})
