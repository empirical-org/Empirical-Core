'use strict'

import React from 'react'
import LoadingSpinner from '../general_components/loading_indicator.jsx'
import $ from 'jquery'

export default React.createClass({

    getInitialState: function() {
        return {loading: false}
    },

    syncClassrooms: function() {
        this.setState({loading: true})
        setTimeout(function() {
            // this is a hack to give enough time for background worker to process.
            // Ultimately we will want to set up a socket that will notify user when
            // background worker is complete
            // window.location.href = '/auth/google_oauth2'
            window.location.href = '/auth/google_oauth2'
        }, 3000);
    },

    displayCopy: function(){
      return (
        <div>
         <p>Made any changes recently to your Google Classroom? Click sync to update your classes on Quill.</p>
         <button onClick={this.syncClassrooms} className='button button-white'><span><img src="/images/google_sync_icon.svg" alt="google sync"/>Sync with Google Classroom</span></button>
       </div>
      )
    },

    render: function() {
        let content = this.state.loading ? <LoadingSpinner/> : this.displayCopy()
        return (
            <div className={"mini_container col-md-4 col-sm-5 text-center"}>
              <div className="mini_content ">
                <div id="google-classroom-mini">
                  <h4>Sync With Google Classroom</h4>
                  {content}
                </div>
              </div>
            </div>
        );}
});
