import React from 'react'
import GoogleClassroomModal from '../../dashboard/google_classroom_modal'

export default React.createClass({
  render: function() {
    return (
      <div>
      <div className="box-top">
        <h1>
          <span>Option 2: </span>Use Google Classroom
          <img src="/images/google_classroom_icon.png" data-pin-nopin="true"/>
        </h1>
      </div>
      <div className="box-content google-classroom">
          <p>
            If you have an account with Google Classroom, you can import all your classes and students to Quill. Your students can log in using their Google accounts.
          </p>
          <button className='white-bg' onClick={this.props.syncOrModal}>Sync With Google Classroom</button>
          <GoogleClassroomModal syncClassrooms={this.props.syncClassrooms} user={this.props.user} show={this.props.showModal} hideModal={this.props.hideModal}/>
        </div>
      </div>
    );
   }
 });
