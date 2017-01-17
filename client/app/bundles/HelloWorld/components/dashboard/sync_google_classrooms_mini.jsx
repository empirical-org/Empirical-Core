'use strict'

import React from 'react'
import LoadingSpinner from '../general_components/loading_indicator.jsx'
import $ from 'jquery'
import GoogleClassroomModal from './google_classroom_modal'

export default React.createClass({

    getInitialState: function() {
        return {loading: false}
    },

    syncClassrooms: function() {
      window.location.href = '/auth/google_oauth2/'
    },

    hideModal() {
      this.setState({showModal: false});
    },

    syncOrModal: function(){
      // if (this.props.user.signedUpWithGoogle) {
      //   // they are already a google user, so we just need to use the callback
      //   // TODO: UNCOMMENT THIS!!!! JUST HERE FOR TESTING
      //   // this.syncClassrooms();
      // } else {
        // they are not a google user, so we will show them the modal where they
        // can become one
        this.setState({showModal: true});
      // }
    },



    displayCopy: function(){
      return (
        <div>
         <p>Made any changes recently to your Google Classroom? Click sync to update your classes on Quill.</p>
         <button onClick={this.syncOrModal} className='button button-white'><span><img src="/images/google_sync_icon.svg" alt="google sync"/>Sync with Google Classroom</span></button>
       </div>
      )
    },

    render: function() {
        let content = this.state.loading ? <LoadingSpinner/> : this.displayCopy()
        return (
            <div className={"mini_container col-md-4 col-sm-5 text-center"}>
              <GoogleClassroomModal syncClassrooms={this.syncClassrooms} user={this.props.user} show={this.state.showModal} hideModal={this.hideModal}/>
              <div className="mini_content ">
                <div id="google-classroom-mini">
                  <h4>Sync With Google Classroom</h4>
                  {content}
                </div>
              </div>
            </div>
        );}
});
