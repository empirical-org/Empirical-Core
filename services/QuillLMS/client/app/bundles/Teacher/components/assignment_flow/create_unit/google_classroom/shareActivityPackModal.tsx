import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { defaultSnackbarTimeout, Snackbar, DropdownInput, Spinner } from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request';

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`;
const shareToGoogleIconSrc = `${process.env.CDN_URL}/images/icons/icons-google-classroom-color.svg`;
const ALL_CLASSES = 'All Classes';

export const ShareActivityPackModal = ({ activityPackData, closeModal, selectedClassroomId, selectedClassroomName, singleActivity, unitId }) => {

  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [selectedClass, setSelectedClass] = React.useState<any>({});
  const [classrooms, setClassrooms] = React.useState<any[]>([])
  const [classroomUnits, setClassroomUnits] = React.useState<any[]>([])
  const [link, setLink] = React.useState<string>(getDefaultLink());

  React.useEffect(() => {
    if(!classrooms.length || (!classroomUnits.length && unitId)) {
      requestGet(`/teachers/classrooms/classrooms_and_classroom_units_for_activity_share/${unitId}`, (body) => {
        const classrooms = body.classrooms && filterClassrooms(body.classrooms.classrooms_and_their_students)
        setClassrooms(classrooms)
        setClassroomUnits(body.classroom_units)
      })
    }
  }, []);

  React.useEffect(() => {
    if(classrooms && classrooms.length) {
      const newLink = getDefaultLink();
      newLink && setLink(newLink);
    }
  }, [classrooms]);

  React.useEffect(() => {
    if(classrooms && classrooms.length) {
      const filteredClassrooms = filterClassrooms(classrooms);
      setClassrooms(filteredClassrooms);
    }
  }, [selectedClassroomId, selectedClassroomName]);

  function filterClassrooms(classrooms) {
    if(selectedClassroomName) {
      return classrooms.filter(classroomObject => classroomObject.classroom.name === selectedClassroomName);
    } else if(selectedClassroomId === ALL_CLASSES) {
      return classrooms
    }
    const id = parseInt(selectedClassroomId);
    return classrooms.filter(classroomObject => classroomObject.classroom.id === id);
  }

  function getDefaultLink() {
    if(classrooms && classrooms.length) {
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
        const classroomUnitId = classroomUnitObject && classroomUnitObject.id || singleActivity.cuId;
        const activityId = singleActivity.activityId || singleActivity.id;
        return `${process.env.DEFAULT_URL}/classroom_units/${classroomUnitId}/activities/${activityId}`;
      }
    }
    return '';
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

  function returnActivityLinkComponent() {
    return(
      <div className="activity-pack-data-container">
        <p className="link-label">Activity pack link</p>
        <p className="activity-pack-link">{link}</p>
      </div>
    )
  }

  function renderActivityAndClassData() {
    if(classrooms.length === 1) {
      return returnActivityLinkComponent()
    } else {
      const showActivityLink = selectedClass && selectedClass.value;
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
                isSearchable={false}
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
              {showActivityLink && returnActivityLinkComponent()}
            </div>
          </div>
        </div>
      )
    }
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
    return `Only students who were assigned "${name}" will be able to open the link.`
  }

  const renderData = classrooms && classrooms.length;

  return(
    <div className="modal-container google-classroom--modal-container">
      <div className="modal-background" />
      <div className="google-classroom-share-activity-modal quill-modal modal-body">
        <div className="title-row">
          <h3 className="title">{getTitle()}</h3>
          <button className='close-button focus-on-light' onClick={handleCloseModal} type="button">
            <img alt="close-icon" src={closeIconSrc} />
          </button>
        </div>
        <p className="disclaimer-text">{getDisclaimer()}</p>
        {renderData && renderActivityAndClassData()}
        <div className="form-buttons">
          <CopyToClipboard onCopy={handleCopyLink} text={link}>
            <button className="quill-button outlined secondary medium focus-on-light" type="button">Copy link</button>
          </CopyToClipboard>
          <button className="quill-button outlined secondary medium focus-on-light" onClick={() => console.log('clicked!')} type="button">
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
