import React from 'react'
import $ from 'jquery'
import emailValidator from '../modules/email_validator'

import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
    getInitialState: function() {
        return {email: this.props.user.email, updated: false, error: null}
    },

    handleChange: function(val) {
        this.setState({email: val.target.value, updated: false})
    },

    setErrorOrSubmit: function(){
      // this should use a more restful route ---
      // right now all of the teacher's self updating is carried out
      // through the classroom manager controller
      if (emailValidator(this.state.email)) {
        const that = this;
        $.ajax({
            url: '/teachers/update_current_user',
            data: { teacher: {email: that.state.email}
            },
            type: 'put',
            statusCode: {
              200: function() {
                that.setState({updated: true}) },
              400: function(response) {
                let error
                if (response.responseJSON.errors.email) {
                  error = 'This email address is already in use. If this is your email, please log in with that account.'
                }
                that.setState({error})
              }
            }
        });
      } else {
        this.setState({error: 'Invalid email address! Please re-type your email address.'})
      }
    },

    handleSubmit: function(event) {
      event.preventDefault()
      this.setState({error: null}, this.setErrorOrSubmit)
    },

    showEmailErrors: function() {
      let content
      if (this.state.error) {
        content = <span><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{this.state.error}</span>
      }
      return <div className="error">{content}</div>
    },

    render: function() {
        const inputBorderColor = this.state.error ? { 'border': '1px solid #ff4542'} : { 'border': '1px solid #737373'}
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal' restoreFocus={true}>
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
