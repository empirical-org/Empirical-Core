import * as React from 'react'

import ActivityPackInformation from './activityPackInformation';
import ShareActivityPackModal from './shareActivityPackModal';

import AssignmentFlowNavigation from '../../assignment_flow_navigation'
import ScrollToTop from '../../../shared/scroll_to_top'
import { Card, ExpandableCard } from '../../../../../Shared/index'
import {
  UNIT_TEMPLATE_NAME,
  UNIT_TEMPLATE_ID,
  UNIT_NAME,
  ACTIVITY_IDS_ARRAY,
  CLASSROOMS,
  UNIT_ID,
} from '../../assignmentFlowConstants'

const addStudentsSrc = `${process.env.CDN_URL}/images/illustrations/add-students.svg`
const addShareActivityPackSrc = `${process.env.CDN_URL}/images/icons/icons-share-activity-pack.svg`

const ShareToGoogleClassroom = ({ activityPackData, assignedClassrooms, classrooms, moveToStage4, state, props }) => {

  const [leaving, setLeaving] = React.useState<boolean>(false);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (leaving) {
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

  function handleExpandCard() {
    setIsExpanded(!isExpanded);
  }

  function handleToggleShareModal() {
    setModalOpen(!modalOpen);
  }

  function getRows(activityPackData) {
    if(!activityPackData) { return [] }
    const { activities } = activityPackData;
    if(!activities || !activities.length) { return }
    return activities.map(activity => {
      const { id, name } = activity;
      return {
        name,
        id
      }
    });
  }

  function renderInviteStudents() {
    const emptyClassrooms = assignedClassrooms.filter(c => !c.students.length)
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

  function renderShareActivityPackCards() {
    const activities = getRows(activityPackData);
    return (
      <section className="share-activity-pack-cards-section">
        <Card
          header="Share the activity pack with your students"
          imgAlt="stack of paper assignments"
          imgSrc={addShareActivityPackSrc}
          onClick={handleToggleShareModal}
          text="Share a link or share with Google Classroom."
        />
        <ExpandableCard
          header="Share an activity with your students"
          imgAlt="stack of paper assignments"
          imgSrc={addShareActivityPackSrc}
          isExpanded={isExpanded}
          onClick={handleExpandCard}
          rows={activities}
          text="Share a link or share with Google Classroom."
        />
      </section>
    )
  }

  // const allClassroomsAreEmpty = assignedClassrooms.every(c => c.classroom.emptyClassroomSelected);
  const allClassroomsAreEmpty = false;
  const button = <button className="quill-button medium contained primary" onClick={handleClick} type="button">Next</button>
  return (
    <div className="assignment-flow-container">
      {modalOpen &&
      <ShareActivityPackModal
        closeModal={handleToggleShareModal}
      />}
      <ScrollToTop />
      <AssignmentFlowNavigation button={button} />
      <div className="google-classroom container">
        <h1>Assigned!</h1>
        <div className="inner-container">
          <ActivityPackInformation activityPackData={activityPackData} />
          {allClassroomsAreEmpty && renderInviteStudents()}
          {!allClassroomsAreEmpty && renderShareActivityPackCards()}
        </div>
      </div>
    </div>
  );
}

export default ShareToGoogleClassroom
