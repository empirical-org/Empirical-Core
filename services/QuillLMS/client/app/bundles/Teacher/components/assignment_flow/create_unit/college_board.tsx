import * as React from 'react';
import AssignmentCard from './assignment_card';
import AssignmentFlowNavigation from '../assignment_flow_navigation'
import ScrollToTop from '../../shared/scroll_to_top'

const selectCard = (history: any, link: string) => {
  history.push(link)
}

const apSrc = `${process.env.CDN_URL}/images/college_board/ap.svg`
const preApSrc = `${process.env.CDN_URL}/images/college_board/pre-ap.svg`

const minis = ({ history }) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore 20 activities based on Pre-AP texts and two skills surveys that provide targeted practice on key writing skills.', },
      { key: 'When', text: 'You want to build foundational skills or provide your students with Quill activities aligned to authentic literary texts.', },
      { key: 'Note', text: 'Pre-AP is for all high school students, with a focus on ninth grade. These activities may be used in all English classes.' }
    ]}
    header="View Pre-AP Activities"
    imgAlt="Page with writing with the word Pre-AP in top left corner"
    imgSrc={preApSrc}
    selectCard={() => selectCard(history, '/assign/pre-ap')}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Assign a skills survey that assesses seven key sentence construction skills and provides up to 40 practice activities.', },
      { key: 'When', text: 'You want to fill gaps in foundational writing skills for students writing at an AP level.', }
    ]}
    header="View AP Activities"
    imgAlt="Page with writing with the word AP in top left corner"
    imgSrc={apSrc}
    selectCard={() => selectCard(history, '/assign/ap')}
  />)
];

const AssignADiagnostic = (props: any) => (
  <div className="assignment-flow-container">
    <AssignmentFlowNavigation />
    <ScrollToTop />
    <div className="diagnostic-page container">
      <h1>Do you want to use activities aligned to Pre-AP or AP courses?</h1>
      <div className="minis">{minis(props)}</div>
    </div>
  </div>
);

export default AssignADiagnostic
