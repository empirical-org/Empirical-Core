import * as React from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  startListeningToSessionWithoutCurrentSlide,
  startListeningToCurrentSlide,
  goToNextSlide,
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
  updateSlideInFirebase
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
    if (ca_id) {
      // this.props.dispatch(getClassroomAndTeacherNameFromServer(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // below is for spoofing if you log in with Amber M. account
      // this.props.dispatch(getClassroomAndTeacherNameFromServer('341912', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames('341912', process.env.EMPIRICAL_BASE_URL))
      this.props.dispatch(getClassLessonFromFirebase(this.props.params.lessonID));
      this.props.dispatch(startListeningToSessionWithoutCurrentSlide(ca_id));
      this.props.dispatch(startListeningToCurrentSlide(ca_id));
    }
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
  }

  handleKeyDown(event) {
    if (event.keyCode === 39) {
      const ca_id: string|null = getParameterByName('classroom_activity_id');
      const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
      const lessonData: ClassroomLesson = this.props.classroomLesson.data;
      if (ca_id) {
        const updateInStore = goToNextSlide(ca_id, sessionData, lessonData);
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
