import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { defaultSnackbarTimeout, Snackbar, DropdownInput, Spinner } from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request';
import { Classroom, ClassroomUnit, DropdownObject, ActivityPack, ActivityElement } from '../../../../../../interfaces/activityPack';
import { DropdownObjectInterface } from '../../../../../Staff/interfaces/evidenceInterfaces';

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`;
const shareToGoogleIconSrc = `${process.env.CDN_URL}/images/icons/icons-google-classroom-color.svg`;
const ALL_CLASSES = 'All Classes';

interface ShareActivityPackModalPropsInterface {
  activityPackData: ActivityPack;
  closeModal: () => void;
  selectableClassrooms?: string[];
  selectedClassroomId?: string;
  selectedClassroomName?: string;
  singleActivity: ActivityElement;
  unitId: string;
}

export const ShareActivityPackModal = ({ activityPackData, closeModal, selectableClassrooms, selectedClassroomId, selectedClassroomName, singleActivity, unitId }: ShareActivityPackModalPropsInterface) => {
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [selectedClass, setSelectedClass] = React.useState<DropdownObject>({ label: '', value: '' });
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [classroomUnits, setClassroomUnits] = React.useState<ClassroomUnit[]>([]);
  const [link, setLink] = React.useState<string>(getDefaultLink());


  React.useEffect(() => {
    requestGet(`/teachers/classrooms/classrooms_and_classroom_units_for_activity_share/${unitId}`, (body) => {
      const classrooms = body.classrooms && filterClassrooms(body.classrooms.classrooms_and_their_students)
      setClassrooms(classrooms)
      setClassroomUnits(body.classroom_units)
    });
  }, []);

  React.useEffect(() => {
    if(classrooms.length && classroomUnits.length) {
      const newLink = getDefaultLink();
      const filteredClassrooms = filterClassrooms(classrooms);
      getSelectedClass(filteredClassrooms);
      newLink && setLink(newLink);
    }
  }, [classrooms, classroomUnits]);

  React.useEffect(() => {
    if(classrooms && classrooms.length) {
      const filteredClassrooms = filterClassrooms(classrooms);
      getSelectedClass(filteredClassrooms);
      setClassrooms(filteredClassrooms);
    }
  }, [selectedClassroomId, selectedClassroomName, selectableClassrooms]);

  function filterClassrooms(classrooms) {
    if(selectedClassroomName) {
      return classrooms.filter(classroomObject => classroomObject.classroom.name === selectedClassroomName);
    }
    if(selectedClassroomId === ALL_CLASSES) {
      return classrooms.filter(classroomObject => selectableClassrooms.includes(classroomObject.classroom.name))
    }
    if(selectedClassroomId) {
      const id = parseInt(selectedClassroomId);
      return classrooms.filter(classroomObject => classroomObject.classroom.id === id);
    }
    return classrooms;
  }

  function getSelectedClass(filteredClassrooms) {
    // we want set selectedClass and return only the link without dropdown if only one class remains after filtering
    if(filteredClassrooms && filteredClassrooms.length === 1) {
      const classroomObject = filteredClassrooms[0];
      const { classroom } = classroomObject;
      const { id, name } = classroom;
      const dropdownOption = {
        value: id,
        label: name
      }
      setSelectedClass(dropdownOption);
    }
  }

  function getDefaultLink() {
    if(!(classrooms.length)) { return '' }
    if(!(classroomUnits.length)) { return '' }
    if(classrooms.length !== 1) { return '' }
    const classroomObject = classrooms[0];
    const classroomUnitObject = classroomUnits[0];
    const { classroom } = classroomObject;
    if(singleActivity) {
      const { id } = classroomUnitObject;
      const activityId = singleActivity.activityId || singleActivity.id
      return `${process.env.DEFAULT_URL}/classroom_units/${id}/activities/${activityId}`;
    }
    if(!singleActivity) {
      const { id } = classroom;
      return `${process.env.DEFAULT_URL}/classrooms/${id}?unit_id=${unitId}`
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

  function handleClassChange(classOption: DropdownObjectInterface) {
    const { value } = classOption;
    setSelectedClass(classOption);
    if(singleActivity) {
      const classroomUnit = classroomUnits.filter(unit => unit.classroom_id === parseInt(value))[0];
      const activityId = singleActivity.activityId || singleActivity.id
      setLink(`${process.env.DEFAULT_URL}/classroom_units/${classroomUnit.id}/activities/${activityId}`);
    } else {
      setLink(`${process.env.DEFAULT_URL}/classrooms/${value}?unit_id=${unitId}`);
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
      if(courseId) { shareUrl += `&courseid=${courseId}` }
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
        <p className="link-label">{singleActivity ? 'Activity link' : 'Activity pack link'}</p>
        <p className="activity-pack-link">{link}</p>
      </div>
    )
  }

  function renderActivityAndClassData(showActivityLink) {
    if(classrooms.length === 1) {
      return returnActivityLinkComponent(showActivityLink);
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
    );
  }

  function renderSnackbar() {
    return <Snackbar text="Link copied" visible={showSnackbar} />
  }

  function getTitle() {
    const activityOrActivityPack = singleActivity ? 'activity' : 'activity pack';
    return `Share this ${activityOrActivityPack} with your students`;
  }

  function getDisclaimer() {
    const name = singleActivity && singleActivity.name || activityPackData.name;
    return `Only students who were assigned "${name}" will be able to open the link.`;
  }

  function renderContent(dataReady: boolean) {
    if(!dataReady) {
      return <Spinner />;
    }
    return(
      <React.Fragment>
        <div className="title-row">
          <h3 className="title">{getTitle()}</h3>
          <button className='close-button focus-on-light' onClick={handleCloseModal} type="button">
            <img alt="close-icon" src={closeIconSrc} />
          </button>
        </div>
        <p className="disclaimer-text">{getDisclaimer()}</p>
        {renderActivityAndClassData(showActivityLink)}
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
      </React.Fragment>
    );
  }

  const dataReady = !!(classrooms && classrooms.length);
  const showActivityLink = selectedClass && selectedClass.value;
  const showContainerStyle = !showActivityLink ? 'hide-modal-element' : '';

  return(
    <div className="modal-container share-activity-pack-modal-container">
      <div className="modal-background" />
      <div className="share-activity-pack-modal quill-modal modal-body">
        {renderContent(dataReady)}
      </div>
      {renderSnackbar()}
    </div>
  );
}

export default ShareActivityPackModal;
