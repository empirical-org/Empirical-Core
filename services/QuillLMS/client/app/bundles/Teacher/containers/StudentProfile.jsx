import React from 'react';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import qs from 'qs'

import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import StudentProfileClassworkTabs from '../components/student_profile/student_profile_classwork_tabs';
import SelectAClassroom from '../../Student/components/selectAClassroom'
import LoadingIndicator from '../components/shared/loading_indicator'
import {
  fetchStudentProfile,
  fetchStudentsClassrooms,
  handleClassroomClick,
  updateActiveClassworkTab
} from '../../../actions/student_profile';
import { TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../constants/student_profile'

class StudentProfile extends React.Component {
  componentDidMount() {
    const {
      fetchStudentProfile,
      fetchStudentsClassrooms,
      classroomId,
    } = this.props;

    if (classroomId) {
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
      fetchStudentsClassrooms();
    } else {
      fetchStudentProfile();
      fetchStudentsClassrooms();
    }

  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedClassroomId, history, student, scores, loading, } = this.props

    if (selectedClassroomId && selectedClassroomId !== prevProps.selectedClassroomId) {
      if (!window.location.href.includes(selectedClassroomId)) {
        history.push(`classrooms/${selectedClassroomId}`);
      }
    }

    if (student !== prevProps.student) {
      this.initializePusher(this.props)
    }

    if (scores && !prevProps.scores && !loading) {
      const focusedUnitId = this.parsedQueryParams().unit_id
      const element = document.getElementById(focusedUnitId)
      const elementTop = element ? element.getBoundingClientRect().top : 0
      window.scrollTo(0, window.pageYOffset + elementTop - 70)
    }
  }

  parsedQueryParams = () => {
    const { history, } = this.props
    return qs.parse(history.location.search.replace('?', ''))
  }

  handleClassroomTabClick = (classroomId) => {
    const { loading, handleClassroomClick, fetchStudentProfile, history, } = this.props;

    if (!loading) {
      const newUrl = `/classrooms/${classroomId}`;
      history.push(newUrl);
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
      updateActiveClassworkTab(TO_DO_ACTIVITIES)
    }
  }

  handleClickAllClasses = () => {
    const { fetchStudentProfile, history, } = this.props;
    history.push('/classes')
    fetchStudentProfile()
  }

  handleClickClassworkTab = (classworkTab) => {
    const { updateActiveClassworkTab, } = this.props
    updateActiveClassworkTab(classworkTab)
  }

  initializePusher = (nextProps) => {
    const { student, fetchStudentProfile, } = nextProps;
    if (student) {
      const classroomId = student.classroom.id;

      if (process.env.RAILS_ENV === 'development') {
        Pusher.logToConsole = true;
      }
      const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
      const channel = pusher.subscribe(classroomId.toString());
      channel.bind('lesson-launched', () => {
        fetchStudentProfile(classroomId);
      });
    }
  }

  render() {
    const {
      classrooms,
      notifications,
      numberOfClassroomTabs,
      student,
      selectedClassroomId,
      showDropdown,
      nextActivitySession,
      loading,
      scores,
      activeClassworkTab,
      isBeingPreviewed,
      history,
    } = this.props;

    if (loading) { return <LoadingIndicator /> }

    if (!selectedClassroomId) { return (<SelectAClassroom classrooms={classrooms} isBeingPreviewed={isBeingPreviewed} onClickCard={this.handleClassroomTabClick} />)}

    return (
      <div className="student-profile-container">
        <StudentProfileHeader
          classroomName={student.classroom.name}
          onClickAllClasses={this.handleClickAllClasses}
          teacherName={student.classroom.teacher.name}
        />
        <div className="header-container">
          <div className="container">
            <h1>Classwork</h1>
          </div>
        </div>
        <StudentProfileClassworkTabs
          activeClassworkTab={activeClassworkTab}
          onClickTab={this.handleClickClassworkTab}
        />
        <div id="student-profile">
          <StudentProfileUnits
            activeClassworkTab={activeClassworkTab}
            data={scores}
            isBeingPreviewed={isBeingPreviewed}
            loading={loading}
            nextActivitySession={nextActivitySession}
            selectedUnitId={this.parsedQueryParams().unit_id}
            teacherName={student.classroom.teacher.name}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  fetchStudentProfile: classroomId => dispatch(fetchStudentProfile(classroomId)),
  fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
  handleClassroomClick: classroomId => dispatch(handleClassroomClick(classroomId)),
  updateActiveClassworkTab: tab => dispatch(updateActiveClassworkTab(tab))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
