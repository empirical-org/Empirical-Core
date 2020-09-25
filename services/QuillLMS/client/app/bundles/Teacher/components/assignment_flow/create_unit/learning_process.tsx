import * as React from 'react'

import AssignmentCard from './assignment_card'

import AssignmentFlowNavigation from '../assignment_flow_navigation'

const allDiagnosticsSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-all.svg`
const librarySrc = `${process.env.CDN_URL}/images/illustrations/library.svg`
const graduationCapSrc = `${process.env.CDN_URL}/images/illustrations/graduation-cap.svg`

const selectCard = (history, link) => history.push(link)

const minis = (props) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Your students complete a short writing assessment, and Quill generates a unique set of practice activities for each student based on their performance.', },
      { key: 'When', text: 'You’re working with a new group of students and need data on what each student needs to practice.', }
    ]}
    header="Assess student writing with a diagnostic"
    imgAlt="page with writing and a magnifying glass over it"
    imgSrc={allDiagnosticsSrc}
    key="diagnostic"
    selectCard={() => selectCard(props.history, `/assign/diagnostic`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Search our library of activities, and then select activities you would like to assign to your students.', },
      { key: 'When', text: 'You know which skills you want your students to practice, or you want to browse our materials before assigning the diagnostic.', }
    ]}
    header="Choose activities from our library"
    imgAlt="open book"
    imgSrc={librarySrc}
    key="activity-type"
    selectCard={() => selectCard(props.history, `/assign/activity-type`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Find activities focused on key Pre-AP and AP writing skills, as well as in-content activities based on Pre-AP texts.', },
      { key: 'When', text: "You're teaching AP or Pre-AP students, or you're interested in using AP or Pre-AP materials with your high school students." }
    ]}
    header="Explore Pre-AP and AP activities"
    imgAlt="graduation cap"
    imgClassName="graduation-cap"
    imgSrc={graduationCapSrc}
    key="college-board"
    selectCard={() => selectCard(props.history, `/assign/college-board`)}
    showNewTag={true}
  />)
];

const LearningProcess = (props) => (
  <div className="assignment-flow-container">
    <AssignmentFlowNavigation />
    <div className="learning-process container">
      <h1>Do you want to assess students' writing or choose activities first?</h1>
      <div className="minis">{minis(props)}</div>
    </div>
  </div>
);

export default LearningProcess
