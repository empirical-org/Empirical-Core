'use strict'

 import React from 'react'

 export default React.createClass({

  miniBuilder: function() {
    return (
      <div className='resources-container google-classroom-announcement'>
        <h4>Google Classroom Announcement</h4>
          <img src='/images/google_classroom_icon.png'></img>
          <p>Your students can now use Clever or Google Classroom to automatically join your classroom.</p>
          <span><a href='https://medium.com/@quill/we-re-now-supporting-google-classroom-and-clever-55f2c12272f7#.xfrtabflg'>Read the Announcement ></a></span>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>
    );
  }
});
