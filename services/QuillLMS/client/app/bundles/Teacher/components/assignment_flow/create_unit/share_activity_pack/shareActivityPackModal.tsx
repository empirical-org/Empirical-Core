import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { defaultSnackbarTimeout, Snackbar, DropdownInput } from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request';
import { Classroom, ClassroomUnit, DropdownObject } from '../../../../../../interfaces/activityPack';

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`;
const shareToGoogleIconSrc = `${process.env.CDN_URL}/images/icons/icons-google-classroom-color.svg`;

export const ShareActivityPackModal = ({ activityPackData, closeModal, singleActivity, unitId }) => {
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [selectedClass, setSelectedClass] = React.useState<DropdownObject>({ label: '', value: '' });
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [classroomUnits, setClassroomUnits] = React.useState<ClassroomUnit[]>([]);
  const [link, setLink] = React.useState<string>(classrooms && classrooms.length && getDefaultLink());

  React.useEffect(() => {
    if(!classrooms.length || (!classroomUnits.length && unitId)) {
      requestGet(`/teachers/classrooms/classrooms_and_classroom_units_for_activity_share/${unitId}`, (body) => {
        setClassrooms(body.classrooms && body.classrooms.classrooms_and_their_students)
        setClassroomUnits(body.classroom_units)
      })
    }
  }, [])

  function getDefaultLink() {
    if(classrooms.length !== 1) {
      return ''
    }
    const classroomObject = classrooms[0];
    const classroomUnitObject = classroomUnits[0];
    const { classroom } = classroomObject;
    if(!singleActivity) {
      const { id } = classroom;
      return `${process.env.DEFAULT_URL}/classrooms/${id}?unit_id=${unitId}`
    } else {
      const { id } = classroomUnitObject;
      return `${process.env.DEFAULT_URL}/classroom_units/${id}/activities/${singleActivity.id}`;
    }
  }

  function getClassroomOptions() {
    return classrooms.map(classroomObject => {
      const { classroom } = classroomObject;
      const { id, name } = classroom;
      return {
        value: id,
        label: name
      }
    });
  }

  function getCourseId() {
    const selectedClassroom = selectedClass && classrooms.filter(classroomObject => classroomObject.classroom.id === parseInt(selectedClass.value))[0];
    return selectedClassroom && selectedClassroom.classroom.google_classroom_id;
  }

  function handleCloseModal() {
    closeModal();
  }

  function handleCopyLink() {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout);
  }

  function handleClassChange(classOption) {
    const { value } = classOption;
    setSelectedClass(classOption);
    if(!singleActivity) {
      setLink(`${process.env.DEFAULT_URL}/classrooms/${value}?unit_id=${unitId}`)
    } else {
      const classroomUnit = classroomUnits.filter(unit => unit.classroom_id === value)[0];
      setLink(`${process.env.DEFAULT_URL}/classroom_units/${classroomUnit.id}/activities/${singleActivity.id}`)
    }
  }

  function handleShareToGoogleClassroomClick() {
    let shareUrl = 'https://classroom.google.com/share?';
    const title = singleActivity && singleActivity.name || activityPackData.name;
    const body = `Work on ${title}`;
    const courseId = getCourseId();
    if(link) {
      shareUrl += `url=${link}&`;
      shareUrl += `title=${title}&`;
      shareUrl += `body=${body}`;
      if(courseId) { shareUrl += `&courseid=` }
      window.open(
        shareUrl,
        '_blank'
      );
    }
  }

  function returnActivityLinkComponent(showActivityLink: boolean) {
    const showContainerStyle = !showActivityLink ? 'hide-modal-element' : '';
    return(
      <div className={`activity-pack-data-container ${showContainerStyle}`}>
        <p className="link-label">Activity pack link</p>
        <p className="activity-pack-link">{link}</p>
      </div>
    )
  }

  function renderActivityAndClassData(showActivityLink) {
    if(classrooms.length === 1) {
      returnActivityLinkComponent(showActivityLink)
    }
    return(
      <div className="class-and-activity-data-container">
        <div className="first-step-container">
          <div className="left-container">
            <div className="step-number-circle"><p>1</p></div>
          </div>
          <div className="right-container">
            <p className="header">Choose a class</p>
            <p className="secondary-text">Since you assigned this activity pack to more than one class you need to select a class to view the share link.</p>
            <DropdownInput
              className="page-number-dropdown"
              handleChange={handleClassChange}
              isSearchable={true}
              label="Choose a class"
              options={getClassroomOptions()}
              value={selectedClass}
            />
          </div>
        </div>
        <div className="second-step-container">
          <div className="left-container">
            <div className="step-number-circle"><p>2</p></div>
          </div>
          <div className="right-container">
            <p className="header">Share with your class</p>
            {returnActivityLinkComponent(showActivityLink)}
          </div>
        </div>
      </div>
    )
  }

  function renderSnackbar() {
    return <Snackbar text="Link copied" visible={showSnackbar} />
  }

  function getTitle() {
    const activityOrActivityPack = singleActivity ? 'activity' : 'activity pack';
    return `Share this ${activityOrActivityPack} with your students`;
  }

  function getDisclaimer() {
    let name = activityPackData.name;
    if(singleActivity) {
      name = singleActivity.name;
    }
    return `Only students who were assigned "${name}" will be able to open the link.`
  }

  const showActivityLink = selectedClass && selectedClass.value;
  const showContainerStyle = !showActivityLink ? 'hide-modal-element' : '';

  return(
    <div className="modal-container google-classroom-modal-container">
      <div className="modal-background" />
      <div className="google-classroom-share-activity-modal quill-modal modal-body">
        <div className="title-row">
          <h3 className="title">{getTitle()}</h3>
          <button className='close-button focus-on-light' onClick={handleCloseModal} type="button">
            <img alt="close-icon" src={closeIconSrc} />
          </button>
        </div>
        <p className="disclaimer-text">{getDisclaimer()}</p>
        {classrooms && renderActivityAndClassData(showActivityLink)}
        <div className={`form-buttons ${showContainerStyle}`}>
          <CopyToClipboard onCopy={handleCopyLink} text={link}>
            <button className="quill-button outlined secondary medium focus-on-light" type="button">Copy link</button>
          </CopyToClipboard>
          <button className="quill-button outlined secondary medium focus-on-light" onClick={handleShareToGoogleClassroomClick} type="button">
            <div className="button-text-container">
              <img alt="close-icon" src={shareToGoogleIconSrc} />
              <p className="button-text">Share to Google Classroom</p>
            </div>
          </button>
        </div>
        {renderSnackbar()}
      </div>
    </div>
  );
}

export default ShareActivityPackModal;
