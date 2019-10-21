import React from 'react'

const paperSrc = `${process.env.CDN_URL}/images/illustrations/paper.svg`

const AssignmentStep = ({ number, header, text }) => (
  <div className="assignment-step">
    <div className="assignment-step-number">{number}</div>
    <p className="assignment-step-header">{header}</p>
    <p className="assignment-step-text">{text}</p>
  </div>
)

const AssignANewActivity = ({ numberOfActivitiesAssigned }) => (<div className="assign-a-new-activity-container">
  <div className="assign-a-new-activity container">
    <div className="assign-a-new-activity-hero">
      <img src={paperSrc} alt="paper scroll" />
      <h1>Find the perfect writing activities for your students.</h1>
      <a href="/assign/learning-process" className="quill-button primary contained large">Explore activities</a>
    </div>
    <p className="previously-assigned-activities">
      You have {numberOfActivitiesAssigned} {numberOfActivitiesAssigned === 1 ? 'activity' : 'activities'} assigned.&nbsp;
      <a href="/teachers/classrooms/activity_planner">View assigned activities</a>
    </p>
    <div className="assignment-steps">
      <AssignmentStep
        number="1"
        header="Choose Assignment Type"
        text="Choose which type of assignment you want to use: diagnostics, whole class activities, or independent practice activities."
      />
      <AssignmentStep
        number="2"
        header="Browse Activities"
        text="Explore our library of diagnostic assessments and learning activities to find the best materials for your students."
      />
      <AssignmentStep
        number="3"
        header="Choose Assignment Type"
        text="Assign these activities to either the whole class or individual students."
      />
    </div>
  </div>
</div>)

export default AssignANewActivity
