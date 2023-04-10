import * as React from 'react'

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import AssignmentCard from './assignment_card'
import ScrollToTop from '../../shared/scroll_to_top'

const packsWholeSrc = `${process.env.CDN_URL}/images/illustrations/packs-whole.svg`
const packsIndependentSrc = `${process.env.CDN_URL}/images/illustrations/packs-independent.svg`

const selectCard = (history, link) => {
  history.push(link)
}

const minis = (props) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore packs that each contain a set of independent practice activities that progressively build the target skill.', },
      { key: 'When', text: 'Skills have already been introduced, or you want students to learn through independent practice rather than whole-class instruction.', },
    ]}
    header="Browse Independent Practice Activity Packs"
    imgAlt="student with open laptop"
    imgSrc={packsIndependentSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=independent-practice`)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore packs that contain a teacher-led lesson paired with follow-up independent practice that reinforces and builds the skill.', },
      { key: 'When', text: 'You want to introduce new concepts through whole-class lessons where you model skills and lead class discussions.', },
      { key: 'Note', text: 'In whole class lessons, students receive feedback from teachers and peers rather than from Quill’s software.', },
    ]}
    header="Browse Whole-Class Lesson Activity Packs"
    imgAlt="teacher pointing at board"
    imgSrc={packsWholeSrc}
    selectCard={() => selectCard(props.history, `/assign/featured-activity-packs?type=whole-class`)}
  />)
]

const ActivityType = (props) => (
  <div className="assignment-flow-container">
    <ScrollToTop />
    <AssignmentFlowNavigation />
    <div className="activity-type container">
      <h1>Do you want to assign only independent practice or lead whole-class lessons?</h1>
      <div className="minis">{minis(props)}</div>
    </div>
  </div>
);

export default ActivityType
