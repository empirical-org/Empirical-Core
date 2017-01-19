import React from 'react'
import $ from 'jquery'
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
    getInitialState: function() {
        return {email: this.props.user.email, updated: false}
    },

    handleChange: function(val) {
        this.setState({email: val.target.value, updated: false})
    },

    handleSubmit: function(event) {
        // this should use a more restful route ---
        // right now all of the teacher's self updating is carried out
        // through the classroom manage controller
        const that = this;
        $.ajax({
            url: '../update_my_account',
            data: {
                email: that.state.email
            },
            type: 'put',
            success: function(result) {
                that.setState({updated: true, email: result.email})
            }
        });
        event.preventDefault();
    },

    render: function() {
        return (
            <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='google-classroom-modal'>
                <Modal.Body>
                    <img className='pull-right react-bootstrap-close' onClick={this.hideModal} src='/images/close_x.svg' alt='close-modal'/>
                    <h1 className='q-h2'>Import Your Google Classrooms</h1>
                    <p>Your Quill email address must be the same as your Google Classroom email. If it is different, you can update your Quill email below. It may take up to ten minutes for your classrooms to import</p>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.email} onChange={this.handleChange}/>
                        <input type="submit" className='q-button cta-button bg-white text-black' value={this.state.updated
                            ? 'Updated'
                            : 'Save Email'} disabled={this.state.updated}/>
                    </form>
                    <a className="q-button cta-button bg-quillgreen text-white" onClick={this.props.syncClassrooms}>
                      Import My Google Classrooms
                    </a>
                </Modal.Body>
            </Modal>
        )
    }

})
