import Pusher from 'pusher-js';
import qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';

import {
  fetchStudentProfile,
  fetchStudentsClassrooms,
  fetchExactScoresData,
  handleClassroomClick,
  updateActiveClassworkTab,
} from '../../../actions/student_profile';
import { TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES } from '../../../constants/student_profile';
import SelectAClassroom from '../../Student/components/selectAClassroom';
import LoadingIndicator from '../components/shared/loading_indicator';
import StudentProfileClassworkTabs from '../components/student_profile/student_profile_classwork_tabs';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import KeyMetrics from '../components/student_profile/key_metrics'

class StudentProfile extends React.Component {
  componentDidMount() {
    const {
      fetchStudentProfile,
      fetchStudentsClassrooms,
      classroomId,
    } = this.props;

    if (classroomId) {
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId)
      fetchStudentsClassrooms();
    } else {
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
    const { classroomsLoaded, handleClassroomClick, history, fetchStudentProfile, } = this.props;

    if (classroomsLoaded) {
      const newUrl = `/classrooms/${classroomId}`;
      history.push(newUrl);
      handleClassroomClick(classroomId);
      updateActiveClassworkTab(TO_DO_ACTIVITIES)
      fetchStudentProfile(classroomId)
    }
  }

  handleClickAllClasses = () => {
    const { fetchStudentProfile, history, } = this.props;
    history.push('/classes')
    fetchStudentProfile()
  }

  handleClickClassworkTab = (classworkTab) => {
    const { updateActiveClassworkTab, exactScoresDataPending, fetchExactScoresData, scores, classroomId, } = this.props
    updateActiveClassworkTab(classworkTab)

    if (classworkTab === COMPLETED_ACTIVITIES && exactScoresDataPending) {
      fetchExactScoresData(scores, classroomId)
    }
  }

  initializePusher = (nextProps) => {
    const { student, fetchStudentProfile, } = nextProps;
    if (student) {
      const classroomId = student.classroom.id;

      if (process.env.RAILS_ENV === 'development') {
        Pusher.logToConsole = true;
      }
      const pusher = new Pusher(process.env.PUSHER_KEY, { cluster: process.env.PUSHER_CLUSTER });
      const channel = pusher.subscribe(classroomId.toString());
      channel.bind('lesson-launched', () => {
        fetchStudentProfile(classroomId);
      });
    }
  }

  render() {
    const {
      classrooms,
      classroomsLoaded,
      student,
      selectedClassroomId,
      nextActivitySession,
      loading,
      scores,
      activeClassworkTab,
      isBeingPreviewed,
      metrics,
      exactScoresDataPending,
      exactScoresData,
      showExactScores,
      completedEvidenceActivityPriorToScoring
    } = this.props;

    if (!selectedClassroomId && classroomsLoaded) { return (<SelectAClassroom classrooms={classrooms} isBeingPreviewed={isBeingPreviewed} onClickCard={this.handleClassroomTabClick} />)}

    if (loading) { return <LoadingIndicator /> }


    return (
      <div className="student-profile-container">
        <StudentProfileHeader
          classroomName={student.classroom.name}
          onClickAllClasses={this.handleClickAllClasses}
          teacherName={student.classroom.teacher.name}
        />
        <div className="header-container">
          <div className="container">
            <h1>Your progress</h1>
            <KeyMetrics
              firstName={student.name.split(' ')[0]}
              metrics={metrics}
            />
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
            completedEvidenceActivityPriorToScoring={completedEvidenceActivityPriorToScoring}
            data={scores}
            exactScoresData={exactScoresData}
            exactScoresDataPending={exactScoresDataPending}
            isBeingPreviewed={isBeingPreviewed}
            loading={loading}
            nextActivitySession={nextActivitySession}
            selectedUnitId={this.parsedQueryParams().unit_id}
            showExactScores={showExactScores}
            teacherName={student.classroom.teacher.name}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  fetchStudentProfile: (classroomId) => dispatch(fetchStudentProfile(classroomId)),
  fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
  fetchExactScoresData: (scores, classroomId) => dispatch(fetchExactScoresData(scores, classroomId)),
  handleClassroomClick: classroomId => dispatch(handleClassroomClick(classroomId)),
  updateActiveClassworkTab: tab => dispatch(updateActiveClassworkTab(tab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
