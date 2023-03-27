declare function require(name:string);
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import {
  clearClassroomLessonFromStore, getClassLesson
} from '../../../actions/classroomLesson';
import {
  createPreviewSession, goToNextSlide,
  goToPreviousSlide,
  registerTeacherPresence,
  startLesson, startListeningToSessionForTeacher
} from '../../../actions/classroomSessions';
import {
  clearEditionQuestions, getCurrentUserAndCoteachersFromLMS,
  getEditionMetadataForUserIds,
  getEditionQuestions
} from '../../../actions/customize';
import * as CustomizeIntf from '../../../interfaces/customize';
import { getParameterByName } from '../../../libs/getParameterByName';
import NavBar from '../../navbar/navbar';
import {
  ClassroomLessonSession, ClassroomSessionId,
  ClassroomUnitId
} from '../interfaces';
import ErrorPage from '../shared/errorPage';
import MainContentContainer from './mainContentContainer';
import Sidebar from './sidebar';

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    const classroomSessionId = classroomUnitId ? classroomUnitId.concat(activityUid) : null

    this.state = {
      classroomUnitId,
      classroomSessionId
    }

    if (classroomSessionId) {
      registerTeacherPresence(classroomSessionId);
    }

    props.dispatch(getCurrentUserAndCoteachersFromLMS())
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentDidMount() {
    const { classroomUnitId, classroomSessionId } = this.state
    const { match, dispatch, classroomLesson, history, } = this.props
    const activityId: string = match.params.lessonID;
    if (classroomUnitId) {
      startLesson(classroomUnitId, classroomSessionId, () => {
        dispatch(startListeningToSessionForTeacher(activityId, classroomUnitId, classroomSessionId));
      });
    } else {
      this.setupPreviewSession()
    }
    if (classroomLesson.hasreceiveddata) {
      dispatch(clearClassroomLessonFromStore());
      dispatch(clearEditionQuestions());
    }
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";

    this.setInitialData(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setInitialData(nextProps)
  }

  componentDidUpdate() {
    const { classroomSessionId, } = this.state
    registerTeacherPresence(classroomSessionId)
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].style.overflowY = "scroll";
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  setInitialData = (props) => {
    const lessonId: string = props.match.params.lessonID
    if (!props.customize.user_id && Object.keys(props.customize.editions).length === 0) {
      this.props.dispatch(getEditionMetadataForUserIds([], lessonId))
    }
    if (props.classroomSessions.hasreceiveddata) {
      if (!props.classroomSessions.data.edition_id && Object.keys(props.customize.editionQuestions).length === 0) {
        window.location.href =`#/customize/${lessonId}?&classroom_unit_id=${getParameterByName('classroom_unit_id')}`
      }
      if (props.classroomSessions.data.edition_id && Object.keys(props.customize.editionQuestions).length === 0) {
        this.props.dispatch(getEditionQuestions(props.classroomSessions.data.edition_id))
      }
      if (!props.classroomLesson.hasreceiveddata) {
        this.props.dispatch(getClassLesson(lessonId));
      }
      if (props.classroomSessions.data.edition_id !== this.props.classroomSessions.data.edition_id && props.classroomSessions.data.edition_id) {
        this.props.dispatch(getEditionQuestions(props.classroomSessions.data.edition_id))
      }
    }
    if (props.customize.user_id !== this.props.customize.user_id || !_.isEqual(props.customize.coteachers, this.props.customize.coteachers)) {
      let user_ids:Array<number> = []
      if (props.customize.coteachers.length > 0) {
        user_ids = props.customize.coteachers.map(c => Number(c.id))
      }
      user_ids.push(props.customize.user_id)
      this.props.dispatch(getEditionMetadataForUserIds(user_ids, lessonId))
    }
  }

  setupPreviewSession = () => {
    const { match, history, dispatch, } = this.props
    const { lessonID, editionID } = match.params;
    const classroomUnitId = createPreviewSession(lessonID, editionID)
    const modalQSValue = getParameterByName('modal')
    const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
    if (classroomUnitId) {
      const route = `/teach/class-lessons/${lessonID}?&classroom_unit_id=${classroomUnitId}${modalQS}`;
      history.push(route)
      const classroomSessionId = classroomUnitId.concat(lessonID)
      this.setState({ classroomSessionId, })
      startLesson(classroomUnitId, classroomSessionId, () => {
        dispatch(startListeningToSessionForTeacher(lessonID, classroomUnitId, classroomSessionId));
      });
      registerTeacherPresence(classroomSessionId);
    }
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
    const { classroomSessionId, } = this.state
    const { match, classroomSessions, classroomLesson, } = this.props
    const classroomActivityError = classroomSessions.error;
    const lessonError = classroomLesson.error;
    const teachLessonContainerStyle = classroomSessions.data && classroomSessions.data.preview
      ? {'height': 'calc(100vh - 113px)'}
      : {'height': 'calc(100vh - 60px)'}
    let component = (
      <div className="teach-lesson-container" style={teachLessonContainerStyle}>
        <Sidebar classroomSessionId={classroomSessionId} match={match} />
        <MainContentContainer match={match} />
      </div>
    );

    if (classroomActivityError) {
      component = <ErrorPage text={classroomActivityError} />
    } else if (lessonError) {
      component = <ErrorPage text={lessonError} />
    }

    return (
      <div>
        <NavBar />
        {component}
      </div>
    )
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
