import React from 'react';

export default class extends React.Component {
  render() {
    let onButtonClick,
      buttonText,
      content,
      title;
    if (this.props.missing === 'activities') {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location.assign('/assign'); }
      buttonText = 'Assign an Activity';
      content = 'In order to access our different reports, you need to assign activities to your students.';
    } else if (this.props.missing === 'students') {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location.assign('/teachers/classrooms'); }
      buttonText = 'Invite Students';
      content = 'In order to access our different reports, you need to invite your students and assign activities.'
    } else if(this.props.missing === 'activitiesWithinDateRange') {
      title = 'You have no reports in that range.';
      onButtonClick = this.props.onButtonClick || null;
      buttonText = 'Reset Date Range';
      content = 'Please select a date range in which you assigned activities or your students worked on them.';
    } else if(this.props.missing === 'activitiesForSelectedClassroom') {
      title = 'You have no activities for that classroom.';
      onButtonClick = this.props.onButtonClick || null;
      buttonText = 'View All Classes';
      content = 'Please select a class that has activities, or assign new activities from the \'Assign Activities\' page.';
    } else {
      title = 'You have no reports yet!';
      onButtonClick = () => { window.location.assign('/teachers/classrooms?modal=create-a-class'); }
      buttonText = 'Create a Class';
      content = 'In order to access our different reports, you need to create a class and assign activities to your students.'
    } return (
      <div className="empty-progress-report">
        <img alt="" src='/images/empty_state_illustration.png' />
        <h1>{title}</h1>
        <p>{content}</p>
        <button className="button-green create-unit featured-button" onClick={onButtonClick}>{buttonText}</button>
        <a href="/teacher-center">Teacher Center</a>
      </div>
    );
  }
}
