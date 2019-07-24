'use strict'

import React from 'react'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import $ from 'jquery'
import GoogleClassroomModal from './google_classroom_modal'
import AddClassSection from './add_class_section.jsx'

export default React.createClass({

  getInitialState: function(){
    return {showModal: false}
  },

    syncClassrooms: function() {
      window.location = '/teachers/classrooms/google_sync'
    },

    hideModal() {
      this.setState({showModal: false});
    },

    syncOrModal: function(){
      if (this.props.user.signed_up_with_google) {
        // they are already a google user, so we just need to use the callback
        this.syncClassrooms();
      } else {
        // they are not a google user, so we will show them the modal where they
        // can become one
        this.setState({showModal: true});
      }
    },


    render: function() {
        return (
            <div className={"mini_container add-or-import col-md-4 col-sm-5 text-center"}>
              <AddClassSection/>
              <span>or</span>
              <div className='dashed' onClick={this.syncOrModal}>
              <GoogleClassroomModal syncClassrooms={this.syncClassrooms} user={this.props.user} show={this.state.showModal} hideModal={this.hideModal}/>
                <div id="google-classroom-mini">
                  <img src="/images/google_sync_icon.svg" alt="google sync"/>
                  <h3>Sync Classrooms from <br/> Google Classroom</h3>
                </div>
              </div>
            </div>
        );}
});
