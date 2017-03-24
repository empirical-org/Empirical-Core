import React from 'react'
import $ from 'jquery'
import emailValidator from '../modules/email_validator'

import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({

    render: function() {
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal'>
                <Modal.Body>
                    <img className='pull-right react-bootstrap-close' onClick={this.props.hideModal} src='/images/close_x.svg' alt='close-modal'/>
                    <h1 className='q-h2'>First: Update Your Email</h1>
                    <p>Your Quill email address must be the same as your Google Classroom email. If your email is the same click Next. If it is different, you can update your Quill email below.</p>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.email} style={inputBorderColor} onChange={this.handleChange}/>
                        <input type="submit" className='q-button cta-button bg-white text-black' value={this.state.updated
                            ? 'Updated!'
                            : 'Update Email'} disabled={this.state.updated}/>
                    </form>
                    {this.showEmailErrors()}
                    <a className="q-button cta-button bg-quillgreen text-white" href='/auth/google_oauth2'>
                      Next: Choose Google Classrooms
                    </a>
                </Modal.Body>
            </Modal>
        )
    }

})
