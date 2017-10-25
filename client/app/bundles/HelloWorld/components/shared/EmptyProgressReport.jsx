import React from 'react';

export default React.createClass({

  render() {
    let onButtonClick,
      buttonText,
      content,
      title;
    if (this.props.missing === 'activities') {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location = '/teachers/classrooms/assign_activities'; }
      buttonText = 'Assign an Activity';
      content = 'In order to access our different reports, you need to assign activities to your students.';
    } else if (this.props.missing === 'students') {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location = '/teachers/classrooms/invite_students'; }
      buttonText = 'Invite Students';
      content = 'In order to access our different reports, you need to invite your students and assign activities.'
    } else if(this.props.missing === 'activitiesWithinDateRange') {
      title = 'You have no reports in that range.';
      onButtonClick = this.props.onButtonClick || null;
      buttonText = 'Reset Date Range';
      content = 'Please select a date range in which you assigned activities or your students worked on them.';
    } else {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location = '/teachers/classrooms/new'; }
      buttonText = 'Create a Class';
      content = 'In order to access our different reports, you need to create a class and assign activities to your students.'
    }
 		return (
   <div className="empty-progress-report">
     <img src='/images/empty_state_illustration.png' />
     <h1>{title}</h1>
     <p>{content}</p>
     <button onClick={onButtonClick} className="button-green create-unit featured-button">{buttonText}</button>
     <a href="/teacher_resources">Teacher Resources</a>
   </div>
 );
  },
});
