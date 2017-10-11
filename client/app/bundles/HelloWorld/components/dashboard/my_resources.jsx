'use strict'

 import React from 'react'
 import VideoMini from './video_mini'
 import TeacherResourcesMini from './teacher_resources_mini'
 import GoogleClassroomMini from './google_classroom_mini'
 import TeacherBestPracticesMini from './teacher_best_practices_mini'
 import BetaMini from './beta_mini.jsx';

 export default React.createClass({

  createMinis: function() {
    return(
      <div>
        <VideoMini videoCode='https://www.youtube.com/embed/i-clKDhqrqQ'/>
        <TeacherResourcesMini/>
        <TeacherBestPracticesMini/>
        <GoogleClassroomMini/>
        <BetaMini />
      </div>);
  },

  render: function() {
    return (
      <div className='dashboard-section-container'>
        <h3 className='dashboard-header'>My Resources</h3>
        <div className='row'>
          {this.createMinis()}
        </div>
      </div>
    );
  }

});
