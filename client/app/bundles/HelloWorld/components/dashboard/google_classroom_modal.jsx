import React from 'react'
import $ from 'jquery'
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  getInitialState: function(){
    return {
      email: this.props.user.email
    }
  },

  handleChange: function(val){
    this.setState({email: val.target.value})
  },

  handleSubmit: function(event){
    // this should use a more restful route ---
    // right now all of the teacher's self updating is carried out
    // through the classroom manage controller
    $.ajax({
      url: '../update_my_account',
      data: {email: this.state.email},
      type: 'put',
      success: function(result) {
          alert('called!')
      }
    });
    event.preventDefault();
  },


  render: function(){
    return(
      <Modal {...this.props} show={this.props.show} onHide={this.props.hideModal} dialogClassName='add-class-modal'>
        <Modal.Body>
          <img className='pull-right react-bootstrap-close' onClick={this.hideModal} src='images/close_x.svg' alt='close-modal'/>
          <h1 className='q-h2'>Import Your Google Classroom</h1>
          <p>Your Quill email address must be the same as your Google Classroom email. If it is different, you can update it below:</p>
            <form onSubmit={this.handleSubmit}>
    <label>
      Email:
          <input type="text" name="name" value={this.state.email} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        </Modal.Body>
      </Modal>
    )
  }

})
