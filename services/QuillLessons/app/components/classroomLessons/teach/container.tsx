declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import WakeLock from 'react-wakelock-react16'

import NavBar from '../../navbar/navbar';
import {
  startListeningToSessionForTeacher,
  goToNextSlide,
  goToPreviousSlide,
  registerTeacherPresence,
  startLesson,
  createPreviewSession
} from '../../../actions/classroomSessions';
import {
  getClassLesson,
  clearClassroomLessonFromStore
} from '../../../actions/classroomLesson';
import {
  getCurrentUserAndCoteachersFromLMS,
  getEditionMetadataForUserIds,
  getEditionQuestions,
  clearEditionQuestions
} from '../../../actions/customize'
import MainContentContainer from './mainContentContainer';
import CLStudentSingleAnswer from '../play/singleAnswer';
import { getParameterByName } from '../../../libs/getParameterByName';
import Sidebar from './sidebar';
import ErrorPage from '../shared/errorPage';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  ClassroomSessionId,
  ClassroomUnitId
} from '../interfaces';
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'
import * as CustomizeIntf from '../../../interfaces/customize'

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    this.state = {
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    props.dispatch(getCurrentUserAndCoteachersFromLMS())
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentDidMount() {
    const { classroomUnitId, classroomSessionId } = this.state
    const { match, dispatch, classroomLesson, } = this.props
    const activityId: string = match.params.lessonID;
    if (classroomUnitId) {
      startLesson(classroomUnitId, classroomSessionId, () => {
        dispatch(startListeningToSessionForTeacher(activityId, classroomUnitId, classroomSessionId));
      });
      registerTeacherPresence(classroomSessionId);
    } else {
      const { lessonID, editionID } = match.params;
      const classroomUnitId = createPreviewSession(lessonID, editionID)
      const modalQSValue = getParameterByName('modal')
      const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
      if (classroomUnitId) {
        document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${lessonID}?&classroom_unit_id=${classroomUnitId}${modalQS}`;
      }
    }
    if (classroomLesson.hasreceiveddata) {
      dispatch(clearClassroomLessonFromStore());
      dispatch(clearEditionQuestions());
    }
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const lessonId: string = nextProps.match.params.lessonID
    if (!nextProps.customize.user_id && Object.keys(nextProps.customize.editions).length === 0) {
      this.props.dispatch(getEditionMetadataForUserIds([], lessonId))
    }
    if (nextProps.classroomSessions.hasreceiveddata) {
      if (!nextProps.classroomSessions.data.edition_id && Object.keys(nextProps.customize.editionQuestions).length === 0) {
        window.location.href =`#/customize/${lessonId}?&classroom_unit_id=${getParameterByName('classroom_unit_id')}`
      }
      if (nextProps.classroomSessions.data.edition_id && Object.keys(nextProps.customize.editionQuestions).length === 0) {
        this.props.dispatch(getEditionQuestions(nextProps.classroomSessions.data.edition_id))
      }
      if (!nextProps.classroomLesson.hasreceiveddata) {
        this.props.dispatch(getClassLesson(lessonId));
      }
      if (nextProps.classroomSessions.data.edition_id !== this.props.classroomSessions.data.edition_id && nextProps.classroomSessions.data.edition_id) {
        this.props.dispatch(getEditionQuestions(nextProps.classroomSessions.data.edition_id))
      }
    }
    if (nextProps.customize.user_id !== this.props.customize.user_id || !_.isEqual(nextProps.customize.coteachers, this.props.customize.coteachers)) {
      let user_ids:Array<number> = []
      if (nextProps.customize.coteachers.length > 0) {
        user_ids = nextProps.customize.coteachers.map(c => Number(c.id))
      }
      user_ids.push(nextProps.customize.user_id)
      this.props.dispatch(getEditionMetadataForUserIds(user_ids, lessonId))
    }
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].style.overflowY = "scroll";
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    const tag = event.target.tagName.toLowerCase()
    const className = event.target.className.toLowerCase()
    if (tag !== 'input' && tag !== 'textarea' && className.indexOf("drafteditor") === -1 && (event.keyCode === 39 || event.keyCode === 37)) {
      const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
      const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
      const editionData: CustomizeIntf.EditionQuestions = this.props.customize.editionQuestions;
      if (classroomSessionId) {
        const updateInStore = event.keyCode === 39
          ? goToNextSlide(sessionData, editionData, classroomSessionId)
          : goToPreviousSlide(sessionData, editionData, classroomSessionId)
        if (updateInStore) {
          this.props.dispatch(updateInStore);
        }
      }
    }
  }

  render() {
    const { match, classroomSessions, classroomLesson, } = this.props
    const classroomActivityError = classroomSessions.error;
    const lessonError = classroomLesson.error;
    const teachLessonContainerStyle = classroomSessions.data && classroomSessions.data.preview
    ? {'height': 'calc(100vh - 113px)'}
    : {'height': 'calc(100vh - 60px)'}
    let component = (
      <div className="teach-lesson-container" style={teachLessonContainerStyle}>
        <WakeLock />
        <Sidebar match={match} />
        <MainContentContainer match={match} />
      </div>
    );

    if (classroomActivityError) {
      component = <ErrorPage text={classroomActivityError} />
    } else if (lessonError) {
      component = <ErrorPage text={lessonError} />
    }

    return (<div>
      <NavBar />
      {component}
    </div>)
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(TeachClassroomLessonContainer);
