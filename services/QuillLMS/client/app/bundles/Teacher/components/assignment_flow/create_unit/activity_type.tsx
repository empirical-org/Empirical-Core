import * as React from 'react'

import AssignmentCard from './assignment_card'

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import ScrollToTop from '../../shared/scroll_to_top'

const packsWholeSrc = `${process.env.CDN_URL}/images/illustrations/packs-whole.svg`
const packsIndependentSrc = `${process.env.CDN_URL}/images/illustrations/packs-independent.svg`
const packsCustomSrc = `${process.env.CDN_URL}/images/illustrations/packs-custom.svg`

const selectCard = (history, link) => {
  history.push(link)
}

const minis = (props) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Each activity pack contains one teacher-led collaborative group lesson and a set of 3-5 follow up independent practice activities.', },
      { key: 'When', text: 'You want to introduce new concepts by leading whole-class lessons where you model concepts and facilitate discussions.', },
      { key: 'Note', text: 'In whole-class lessons, students receive feedback from teachers and peers rather than from Quill’s software.', }
    ]}
    header="Browse packs with whole-class and independent practice"
    imgAlt="teacher pointing at board"
    imgSrc={packsWholeSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=whole-class`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'An activity pack contains a set of 5-10 activities that each take 10-15 minutes to complete.', },
      { key: 'When', text: 'You would like your students to independently practice a set of grammar activities and receive automatic feedback from Quill.', }
    ]}
    header="Browse packs with just independent practice"
    imgAlt="student with open laptop"
    imgSrc={packsIndependentSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=independent-practice`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore all of the activities in our library, and build your own activity pack.', },
      { key: 'When', text: 'You want to assemble a specific sequence of independent practice and whole-class activities rather than using a preassembled pack.', },
    ]}
    header="Create your own activity pack"
    imgAlt="sheets of paper overlaid"
    imgSrc={packsCustomSrc}
    selectCard={() => selectCard(props.history, `/assign/create-activity-pack`)}
  />)
]

const ActivityType = (props) => (
  <div className="assignment-flow-container">
    <ScrollToTop />
    <AssignmentFlowNavigation />
    <div className="activity-type container">
      <h1>Do you want to lead whole-class lessons or assign only independent practice?</h1>
      <div className="minis">{minis(props)}</div>
    </div>
  </div>
);

export default ActivityType
