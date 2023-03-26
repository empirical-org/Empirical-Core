import * as React from 'react'

import ScrollToTop from '../../shared/scroll_to_top'
import AssignmentFlowNavigation from '../assignment_flow_navigation'
import AssignmentCard from './assignment_card'

const packsWholeSrc = `${process.env.CDN_URL}/images/illustrations/packs-whole.svg`
const packsIndependentSrc = `${process.env.CDN_URL}/images/illustrations/packs-independent.svg`

const selectCard = (history, link) => {
  history.push(link)
}

const minis = (props) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore packs that contain a teacher-led lesson paired with follow-up independent practice that reinforces and builds the skill.', },
      { key: 'When', text: 'You want to introduce new concepts through whole-class lessons where you model skills and lead class discussions.', },
      { key: 'Note', text: 'In whole class lessons, students receive feedback from teachers and peers rather than from Quill’s software.', }
    ]}
    header="Browse activity packs with whole-class lessons and independent practice"
    imgAlt="teacher pointing at board"
    imgSrc={packsWholeSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=whole-class`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore packs that each contain a set of independent practice activities that progressively build the target skill.', },
      { key: 'When', text: 'Skills have already been introduced, or you want students to learn through independent practice rather than whole-class instruction.', }
    ]}
    header="Browse activity packs with only independent practice "
    imgAlt="student with open laptop"
    imgSrc={packsIndependentSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=independent-practice`)}
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
