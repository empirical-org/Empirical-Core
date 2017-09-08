import * as React from 'react';
import { connect } from 'react-redux';
const WakeLock: any = require('react-wakelock').default;
import {
  startListeningToSession,
  startListeningToSessionWithoutCurrentSlide,
  startListeningToCurrentSlide,
  goToNextSlide,
  goToPreviousSlide,
  updateCurrentSlide,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  getClassroomAndTeacherNameFromServer,
  toggleOnlyShowHeaders,
  clearAllSelectedSubmissions,
  toggleStudentFlag,
  clearAllSubmissions,
  updateSlideInFirebase,
  registerTeacherPresence,
  loadStudentNames,
  startLesson
} from 'actions/classroomSessions';
import {
  getClassLessonFromFirebase
} from 'actions/classroomLesson';
import CLLobby from './lobby';
import CLStatic from './static';
import CLSingleAnswer from './singleAnswer';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static';
import MainContentContainer from './mainContentContainer';
import CLStudentSingleAnswer from '../play/singleAnswer';
import { getParameterByName } from 'libs/getParameterByName';
import Sidebar from './sidebar';
import ErrorPage from '../shared/errorPage';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
} from '../interfaces';
import {
  ClassroomLesson
} from 'interfaces/classroomLessons'

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentDidMount() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    const lesson_id: string = this.props.params.lessonID
    if (ca_id) {
      startLesson(ca_id)
      // below is for spoofing if you log in with Amber M. account
      // this.props.dispatch(getClassroomAndTeacherNameFromServer('341912', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames('341912', process.env.EMPIRICAL_BASE_URL))
      this.props.dispatch(getClassLessonFromFirebase(lesson_id));
      this.props.dispatch(startListeningToSessionWithoutCurrentSlide(ca_id, lesson_id));
      this.props.dispatch(startListeningToCurrentSlide(ca_id));
      registerTeacherPresence(ca_id)

    }
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
  }

  handleKeyDown(event) {
    const tag = event.target.tagName.toLowerCase()
    const className = event.target.className.toLowerCase()
    if (tag !== 'input' && tag !== 'textarea' && className.indexOf("drafteditor") === -1 && (event.keyCode === 39 || event.keyCode === 37)) {
      const ca_id: string|null = getParameterByName('classroom_activity_id');
      const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
      const lessonData: ClassroomLesson = this.props.classroomLesson.data;
      if (ca_id) {
        const updateInStore = event.keyCode === 39
          ? goToNextSlide(ca_id, sessionData, lessonData)
          : goToPreviousSlide(ca_id, sessionData, lessonData)
        if (updateInStore) {
          this.props.dispatch(updateInStore);
        }
      }
    }
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].style.overflowY = "scroll";
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  render() {
    const classroomActivityError = this.props.classroomSessions.error;
    const lessonError = this.props.classroomLesson.error;
    if (classroomActivityError) {
      return <ErrorPage text={classroomActivityError} />
    } else if (lessonError) {
      return <ErrorPage text={lessonError} />
    }  else {
      return (
        <div className="teach-lesson-container">
          <WakeLock />
          <Sidebar/>
          <MainContentContainer/>
        </div>
      );
    }
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(TeachClassroomLessonContainer);
