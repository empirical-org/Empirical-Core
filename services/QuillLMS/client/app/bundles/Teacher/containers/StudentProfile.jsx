import React from 'react';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';

import NotificationFeed  from '../components/student_profile/notification_feed';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import StudentProfileClassworkTabs from '../components/student_profile/student_profile_classwork_tabs';
import SelectAClassroom from '../../Student/components/selectAClassroom'
import LoadingIndicator from '../components/shared/loading_indicator'
import {
  fetchNotifications,
  fetchStudentProfile,
  fetchStudentsClassrooms,
  handleClassroomClick,
  updateActiveClassworkTab
} from '../../../actions/student_profile';
import { TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../constants/student_profile'


class StudentProfile extends React.Component {
  componentDidMount() {
    const {
      fetchNotifications,
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

    // Remove following conditional when student notifications are ready to display
    const displayFeature = false;
    if (displayFeature) {
      fetchNotifications();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedClassroomId, history, student, } = this.props
    if (nextProps.selectedClassroomId && nextProps.selectedClassroomId !== selectedClassroomId) {
      if (!window.location.href.includes(nextProps.selectedClassroomId)) {
        history.push(`classrooms/${nextProps.selectedClassroomId}`);
      }
    }

    if (student !== nextProps.student) {
      this.initializePusher(nextProps)
    }
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
    } = this.props;

    if (loading) { return <LoadingIndicator /> }

    if (!selectedClassroomId) { return (<SelectAClassroom classrooms={classrooms} isBeingPreviewed={isBeingPreviewed} onClickCard={this.handleClassroomTabClick} />)}

    return (<div className="student-profile-container">
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
          teacherName={student.classroom.teacher.name}
        />
      </div>
    </div>);
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  fetchNotifications: () => dispatch(fetchNotifications()),
  fetchStudentProfile: classroomId => dispatch(fetchStudentProfile(classroomId)),
  fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
  handleClassroomClick: classroomId => dispatch(handleClassroomClick(classroomId)),
  updateActiveClassworkTab: tab => dispatch(updateActiveClassworkTab(tab))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
