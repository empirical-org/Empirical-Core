import * as React from 'react'

import ActivityPackInformation from './activityPackInformation';

import AssignmentFlowNavigation from '../../assignment_flow_navigation'
import AssignmentCard from '../assignment_card'
import ScrollToTop from '../../../shared/scroll_to_top'
import { Card } from '../../../../../Shared/index'

import {
  UNIT_TEMPLATE_NAME,
  UNIT_TEMPLATE_ID,
  UNIT_NAME,
  ACTIVITY_IDS_ARRAY,
  CLASSROOMS,
  UNIT_ID,
} from '../../assignmentFlowConstants'

const addStudentsSrc = `${process.env.CDN_URL}/images/illustrations/add-students.svg`

const selectCard = (history, link) => {
  history.push(link)
}

const ShareToGoogleClassroom = ({ activityPackData, assignedClassrooms, classrooms, moveToStage4, state, props }) => {
  const [leaving, setLeaving] = React.useState<boolean>(false);
  // console.log('props', props)
  // console.log('state', state)

  React.useEffect(() => {
    if (leaving) {
      console.log('...removing')
      window.localStorage.removeItem(UNIT_TEMPLATE_ID);
      window.localStorage.removeItem(UNIT_TEMPLATE_NAME);
      window.localStorage.removeItem(UNIT_NAME);
      window.localStorage.removeItem(ACTIVITY_IDS_ARRAY);
      window.localStorage.removeItem(CLASSROOMS);
      window.localStorage.removeItem(UNIT_ID);
      window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms`;
    }
  }, [leaving]);

  function handleClick() {
    moveToStage4();
  }

  function handleGoToClassroomIndex() {
    setLeaving(true);
  }

  function renderInviteStudents() {
    const emptyClassrooms = classrooms.filter(c => !c.students.length)
    const numberOfClassroomsFirstText = `${emptyClassrooms.length} ${emptyClassrooms.length === 1 ? 'class' : 'classes'}`
    const numberOfClassroomsSecondText = `${emptyClassrooms.length === 1 ? 'has' : 'have'}`
    return (<Card
      header="Invite students to your classes"
      imgAlt="students"
      imgSrc={addStudentsSrc}
      onClick={handleGoToClassroomIndex}
      text={`You currently have ${numberOfClassroomsFirstText} that ${numberOfClassroomsSecondText} no students.`}
    />)
  }
  const allClassroomsAreEmpty = assignedClassrooms.every(c => c.classroom.emptyClassroomSelected);
  const button = <button className="quill-button medium contained primary" onClick={handleClick} type="button">Next</button>
  return (
    <div className="assignment-flow-container">
      <ScrollToTop />
      <AssignmentFlowNavigation button={button} />
      <div className="google-classroom container">
        <h1>Assigned!</h1>
        <ActivityPackInformation activityPackData={activityPackData} />
        {allClassroomsAreEmpty && renderInviteStudents()}
      </div>
    </div>
  );
}

export default ShareToGoogleClassroom