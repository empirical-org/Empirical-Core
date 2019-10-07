import * as React from 'react'

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import AssignmentCard from './assignment_card'

const packsWholeSrc = `${process.env.CDN_URL}/images/illustrations/packs-whole.svg`
const packsIndependentSrc = `${process.env.CDN_URL}/images/illustrations/packs-independent.svg`
const packsCustomSrc = `${process.env.CDN_URL}/images/illustrations/packs-custom.svg`

const minis = [
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/assign/featured-activity-packs?type=whole-class`}
    header="Browse packs with whole class and independent practice"
    imgSrc={packsWholeSrc}
    imgAlt="teacher pointing at board"
    bodyArray={[
      { key: 'What', text: 'Each activity pack contains one teacher-led collaborative group lesson and a set of 3-5 follow up independent practice activities.', },
      { key: 'When', text: 'You want to introduce new concepts by leading whole-group lessons where you model concepts and facilitate discussions.', },
      { key: 'Note', text: 'In whole class lessons, students receive feedback from teachers and peers rather than from Quill’s software.', }
    ]}
  />),
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/assign/featured-activity-packs?type=independent-practice`}
    header="Browse packs with just independent practice"
    imgSrc={packsIndependentSrc}
    imgAlt="student with open laptop"
    bodyArray={[
      { key: 'What', text: 'An activity pack contains a set of 5-10 activities that each take 10-15 minutes to complete.', },
      { key: 'When', text: 'You would like your students to independently practice a set of grammar activities and receive automatic feedback from Quill.', },
      { key: 'Note', text: 'In whole class lessons, students receive feedback from teachers and peers rather than from Quill’s software.', }
    ]}
  />),
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/assign/create-activity-pack`}
    header="Create your own activity pack"
    imgSrc={packsCustomSrc}
    imgAlt="sheets of paper overlaid"
    bodyArray={[
      { key: 'What', text: 'Explore all of the activities in our library, and build your own activity pack.', },
      { key: 'When', text: 'You want to assemble a specific sequence of independent practice and whole class activities rather than using a preassembled pack.', },
    ]}
  />)
];

const ActivityType = () => (
  <div className="assignment-flow-container">
    <AssignmentFlowNavigation url={window.location.href} />
    <div className="activity-type container">
      <h1>Do you want to lead whole-class lessons or assign only independent practice?</h1>
      <div className="minis">{minis}</div>
    </div>
  </div>
);

export default ActivityType
