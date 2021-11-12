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
  CLASSROOM_UNITS,
  ASSIGNED_CLASSROOMS
} from '../../assignmentFlowConstants'

const addStudentsSrc = `${process.env.CDN_URL}/images/illustrations/add-students.svg`
const addShareActivityPackSrc = `${process.env.CDN_URL}/images/icons/icons-share-activity-pack.svg`
const shareActivitySrc = `${process.env.CDN_URL}/images/icons/icons-share.svg`

const ShareToGoogleClassroom = ({ activityPackData, assignedClassrooms, moveToStage4 }) => {

  const unitId = window.localStorage.getItem(UNIT_ID);
  const classroomUnits = JSON.parse(window.localStorage.getItem(CLASSROOM_UNITS));
  const classrooms = JSON.parse(window.localStorage.getItem(ASSIGNED_CLASSROOMS));

  const [leaving, setLeaving] = React.useState<boolean>(false);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [activityPack, setActivityPack] = React.useState<any>(activityPackData);
  const [singleActivity, setSingleActivity] = React.useState<any>(null);

  React.useEffect(() => {
    if (leaving) {
      window.localStorage.removeItem(UNIT_TEMPLATE_ID);
      window.localStorage.removeItem(UNIT_TEMPLATE_NAME);
      window.localStorage.removeItem(UNIT_NAME);
      window.localStorage.removeItem(ACTIVITY_IDS_ARRAY);
      window.localStorage.removeItem(CLASSROOMS);
      window.localStorage.removeItem(UNIT_ID);
      window.localStorage.removeItem(CLASSROOM_UNITS);
      window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms`;
    }
  }, [leaving]);

  React.useEffect(() => {
    setActivityPack(activityPackData);
  }, [activityPackData]);

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

  function handleShareActivityPackClick() {
    // clear data in case user clicked share single activity and closed out modal
    setSingleActivity(null);
    handleToggleShareModal();
  }

  function handleShareActivityClick(id) {
    if(activityPack && activityPack.activities) {
      const { activities } = activityPack;
      const activity = activities.filter(activity => activity.id === id)[0];
      setSingleActivity(activity);
      handleToggleShareModal();
    }
  }

  function getRows(activityPackData) {
    if(!activityPackData) { return [] }
    const { activities } = activityPackData;
    if(!activities || !activities.length) { return }
    return activities.map(activity => {
      const { id, name } = activity;
      return {
        name,
        id,
        imgAlt: 'share-arrow',
        imgSrc: shareActivitySrc,
        onClick: () => handleShareActivityClick(id)
      }
    });
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

  function renderShareActivityPackCards() {
    const activities = getRows(activityPackData);
    return (
      <section className="share-activity-pack-cards-section">
        <Card
          header="Share the activity pack with your students"
          imgAlt="A group of documents with a url link and a google classroom icon"
          imgSrc={addShareActivityPackSrc}
          onClick={handleShareActivityPackClick}
          text="Share a link or share with Google Classroom."
        />
        <ExpandableCard
          header="Share an activity with your students"
          imgAlt="A single document with a url link and a google classroom icon"
          imgSrc={addShareActivityPackSrc}
          isExpanded={isExpanded}
          onClick={handleExpandCard}
          rows={activities}
          text="Share a link or share with Google Classroom."
        />
      </section>
    )
  }

  const allClassroomsAreEmpty = classrooms.every(c => c.classroom.emptyClassroomSelected);
  const button = <button className="quill-button medium contained primary" onClick={handleClick} type="button">Next</button>
  return (
    <div className="assignment-flow-container">
      {modalOpen &&
      <ShareActivityPackModal
        activityPackData={activityPack}
        classrooms={classrooms}
        classroomUnits={classroomUnits}
        closeModal={handleToggleShareModal}
        singleActivity={singleActivity}
        unitId={unitId}
      />}
      <ScrollToTop />
      <AssignmentFlowNavigation button={button} />
      <div className="google-classroom container">
        <h1>Assigned!</h1>
        <div className="inner-container">
          <ActivityPackInformation activityPackData={activityPack} classroomData={classrooms} />
          {allClassroomsAreEmpty && renderInviteStudents()}
          {!allClassroomsAreEmpty && renderShareActivityPackCards()}
        </div>
      </div>
    </div>
  );
}

export default ShareToGoogleClassroom
