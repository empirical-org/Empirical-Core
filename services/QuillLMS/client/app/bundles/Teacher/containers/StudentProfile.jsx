import React from 'react';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';

import NextActivity from '../components/student_profile/next_activity.jsx';
import NotificationFeed  from '../components/student_profile/notification_feed';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import StudentProfileClassworkTabs from '../components/student_profile/student_profile_classwork_tabs';
import SelectAClassroom from '../../Student/components/selectAClassroom'
import {
  fetchNotifications,
  fetchStudentProfile,
  fetchStudentsClassrooms,
  handleClassroomClick,
  updateActiveClassworkTab
} from '../../../actions/student_profile';
import { ALL_ACTIVITIES, TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../constants/student_profile'


class StudentProfile extends React.Component {
  constructor(props) {
    super(props);
  }

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

  componentWillReceiveProps(nextProps) {
    const { selectedClassroomId, router, } = this.props
    if (nextProps.selectedClassroomId && nextProps.selectedClassroomId !== selectedClassroomId) {
      if (!window.location.href.includes(nextProps.selectedClassroomId)) {
        router.push(`classrooms/${nextProps.selectedClassroomId}`);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  handleClassroomTabClick = (classroomId) => {
    const { loading, handleClassroomClick, fetchStudentProfile, router, } = this.props;

    if (!loading) {
      const newUrl = `/classrooms/${classroomId}`;
      router.push(newUrl);
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
      updateActiveClassworkTab(ALL_ACTIVITIES)
    }
  }

  handleClickAllClasses = () => {
    const { fetchStudentProfile, router, } = this.props;
    router.push('/profile')
    fetchStudentProfile()
  }

  handleClickClassworkTab = (classworkTab) => {
    const { updateActiveClassworkTab, } = this.props
    updateActiveClassworkTab(classworkTab)
  }

  initializePusher = () => {
    const { student, fetchStudentProfile, } = this.props;

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
      activeClassworkTab
    } = this.props;

    if (loading) { return <span /> }

    if (!selectedClassroomId) { return (<SelectAClassroom classrooms={classrooms} onClickCard={this.handleClassroomTabClick} />)}

    const nextActivity = nextActivitySession ? (<NextActivity
      activityClassificationId={nextActivitySession.activity_classification_id}
      activityId={nextActivitySession.activity_id}
      caId={nextActivitySession.ca_id}
      hasActivities={scores.length > 0}
      loading={loading}
      maxPercentage={nextActivitySession.max_percentage}
      name={nextActivitySession.name}
    />) : null;

    return (<div className="student-profile-container">
      <StudentProfileHeader
        classroomName={student.classroom.name}
        onClickAllClasses={this.handleClickAllClasses}
        teacherName={student.classroom.teacher.name}
      />
      <StudentProfileClassworkTabs
        activeClassworkTab={activeClassworkTab}
        onClickTab={this.handleClickClassworkTab}
      />
      <div id="student-profile">
        <NotificationFeed notifications={notifications} />
        <StudentProfileUnits
          data={scores}
          loading={loading}
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
