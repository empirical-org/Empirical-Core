import * as React from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  startListeningToSessionWithoutCurrentSlide,
  startListeningToCurrentSlide,
  goToNextSlide,
  updateCurrentSlide,
  updateCurrentSlideInStore,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  getClassroomAndTeacherNameFromServer,
  loadStudentNames,
  toggleOnlyShowHeaders,
  clearAllSelectedSubmissions,
  toggleStudentFlag
  clearAllSubmissions,
  updateSlideInFirebase
} from '../../../actions/classroomSessions';
import CLLobby from './lobby';
import CLStatic from './static.jsx';
import CLSingleAnswer from './singleAnswer.jsx';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static.jsx';
import MainContentContainer from './mainContentContainer.jsx';
import CLStudentSingleAnswer from '../play/singleAnswer.jsx';
import { getParameterByName } from 'libs/getParameterByName';
import Sidebar from './sidebar.jsx'
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
} from '../interfaces';

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      // this.props.dispatch(getClassroomAndTeacherNameFromServer(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // below is for spoofing if you log in with Amber M. account
      // this.props.dispatch(getClassroomAndTeacherNameFromServer('341912', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames('341912', process.env.EMPIRICAL_BASE_URL))
      this.props.dispatch(startListeningToSessionWithoutCurrentSlide(ca_id));
      this.props.dispatch(startListeningToCurrentSlide(ca_id));
    }
  }


  render() {
        return (
          <div className="teach-lesson-container">
            <Sidebar/>
            <MainContentContainer/>
          </div>
        );

}

function select(props) {
  return {};
}

export default connect(select)(TeachClassroomLessonContainer);
