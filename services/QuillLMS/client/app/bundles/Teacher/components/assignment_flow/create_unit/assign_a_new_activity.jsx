import React from 'react'

const paperSrc = `${process.env.CDN_URL}/images/illustrations/paper.svg`

const AssignANewActivity = (props) => (<div className="assign-a-new-activity container">
  <div className="assign-a-new-activity-hero">
    <img src={paperSrc} alt="paper scroll" />
    <h1>Find the perfect writing activities for your students.</h1>
    <a href="/assign/learning-process" className="quill-button primary contained large">Explore activities</a>
  </div>
  <p className="previously-assigned-activities">
    You have {props.numberOfActivitiesAssigned} {props.numberOfActivitiesAssigned === 1 ? 'activity' : 'activities'} assigned.&nbsp;
    <a href="/teachers/classrooms/activity_planner">View assigned activities</a>
  </p>
  <div className="assignment-steps">
    <div className="assignment-step">
      <div className="assignment-step-number">1</div>
      <p className="assignment-step-header">Choose Assignment Type</p>
      <p className="assignment-step-text">Choose which type of assignment you want to use: diagnostics, whole class activities, or independent practice.</p>
    </div>
    <div className="assignment-step">
      <div className="assignment-step-number">2</div>
      <p className="assignment-step-header">Browse Activities</p>
      <p className="assignment-step-text">Explore our library of diagnostic assessments and learning activities to find the best materials for your students.</p>
    </div>
    <div className="assignment-step">
      <div className="assignment-step-number">3</div>
      <p className="assignment-step-header">Choose Assignment Type</p>
      <p className="assignment-step-text">Assign these activities to either the entire class or individual students.</p>
    </div>
  </div>
</div>)

export default AssignANewActivity
