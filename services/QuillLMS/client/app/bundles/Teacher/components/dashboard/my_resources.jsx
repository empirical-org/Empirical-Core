import React from 'react';
import TeacherResourcesMini from './teacher_resources_mini';
import GoogleClassroomMini from './google_classroom_mini';
import TeacherBestPracticesMini from './teacher_best_practices_mini';

export default React.createClass({

  createMinis() {
    return (
       <div>
        <TeacherResourcesMini />
        <TeacherBestPracticesMini />
        <GoogleClassroomMini />
      </div>);
  },

  render() {
    return (
       <div className="dashboard-section-container">
        <h3 className="dashboard-header">My Resources</h3>
        <div className="row">
          {this.createMinis()}
        </div>
      </div>
     );
  },

});
