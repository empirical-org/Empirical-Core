import React from 'react';

export default React.createClass({

  render() {
    let link,
      buttonText,
      content;
    if (this.props.missing === 'activities') {
      link = '/teachers/classrooms/activity_planner/assign-new-activity';
      buttonText = 'Assign an Activity';
      content = 'In order to access our different reports, you need to assign activities to your students.';
    } else if (this.props.missing === 'students') {
      link = '/teachers/classrooms/invite_students';
      buttonText = 'Invite Students';
      content = 'In order to access our different reports, you need to invite your students and assign activities.'
    } else {
      link = '/teachers/classrooms/new';
      buttonText = 'Create a Class';
      content = 'In order to access our different reports, you need to create a class and assign activities to your students.'
    }
 		return (
   <div className="empty-progress-report">
     <img src='/images/empty_state_illustration.png' />
     <h1>You have no reports yet!</h1>
     <p>{content}</p>
     <button onClick={() => { window.location = link; }} className="button-green create-unit featured-button">{buttonText}</button>
     <a href="/teacher_resources">Teacher Resources</a>
     {/* <div className="row empty-state-manager">
       <div className="col-xs-7">
         {content}
       </div>
       <div className="col-xs-4">
         <button onClick={() => { window.location = link; }} className="button-green create-unit featured-button">{buttonText}</button>
       </div>
     </div> */}
   </div>
 );
  },
});
