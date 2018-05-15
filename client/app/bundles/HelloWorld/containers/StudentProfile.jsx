import React from 'react';
import StudentsClassroomsHeader from '../components/student_profile/students_classrooms/students_classrooms_header.jsx';
import NextActivity from '../components/student_profile/next_activity.jsx';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import {
  fetchStudentProfile,
  fetchStudentsClassrooms,
  updateNumberOfClassroomTabs,
  handleClassroomClick,
  hideDropdown,
  toggleDropdown
} from '../../../actions/student_profile';

class StudentProfile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClassroomTabClick = this.handleClassroomTabClick.bind(this);
    this.initializePusher = this.initializePusher.bind(this);
  }

  componentDidMount() {
    const {
      updateNumberOfClassroomTabs,
      fetchStudentProfile,
      fetchStudentsClassrooms,
      classroomId
    } = this.props;

    if (classroomId) {
      handleClassroomClick(classroomId)
      fetchStudentProfile(classroomId);
      fetchStudentsClassrooms();
    } else {
      fetchStudentProfile();
      fetchStudentsClassrooms();
    }

    window.addEventListener('resize', () => {
      updateNumberOfClassroomTabs(window.innerWidth);
    });
    updateNumberOfClassroomTabs(window.innerWidth);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedClassroomId !== this.props.selectedClassroomId) {
      if (!window.location.href.includes(nextProps.selectedClassroomId)) {
        this.props.history.push(`/classrooms/${nextProps.selectedClassroomId}`)
      }
    }
  }

  componentDidUpdate() {
    this.initializePusher();
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  handleClassroomTabClick(classroomId) {
    const { loading, handleClassroomClick, fetchStudentProfile, history} = this.props;

    if (!loading) {
      const newUrl = `/classrooms/${classroomId}`
      if (history) {
        history.push(newUrl)
      } else {
        window.location.href = newUrl
      }
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
    }
  }

  initializePusher() {
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
      numberOfClassroomTabs,
      student,
      selectedClassroomId,
      hideDropdown,
      toggleDropdown,
      showDropdown,
      nextActivitySession,
      loading,
      scores,
    } = this.props;

    if (!loading) {
      const nextActivity = nextActivitySession ? (<NextActivity
        loading={loading}
        hasActivities={scores.length > 0}
        name={nextActivitySession.name}
        caId={nextActivitySession.ca_id}
        activityClassificationId={nextActivitySession.activity_classification_id}
        maxPercentage={nextActivitySession.max_percentage}
      />) : null;
      return (
        <div id="student-profile">
          <StudentsClassroomsHeader
            classrooms={classrooms}
            numberOfClassroomTabs={numberOfClassroomTabs}
            selectedClassroomId={selectedClassroomId || student.classroom.id}
            handleClick={this.handleClassroomTabClick}
            hideDropdown={hideDropdown}
            toggleDropdown={toggleDropdown}
            showDropdown={showDropdown}
          />
          <StudentProfileHeader
            studentName={student.name}
            classroomName={student.classroom.name}
            teacherName={student.classroom.teacher.name}
          />
          {nextActivity}
          <StudentProfileUnits
            data={scores}
            loading={loading}
          />
        </div>
      );
    } return <span />;
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  fetchStudentProfile: classroomId => dispatch(fetchStudentProfile(classroomId)),
  updateNumberOfClassroomTabs: screenWidth => dispatch(updateNumberOfClassroomTabs(screenWidth)),
  fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
  handleClassroomClick: classroomId => dispatch(handleClassroomClick(classroomId)),
  hideDropdown: () => dispatch(hideDropdown()),
  toggleDropdown: () => dispatch(toggleDropdown()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
