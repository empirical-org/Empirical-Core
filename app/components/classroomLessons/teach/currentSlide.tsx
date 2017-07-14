import * as React from 'react';
import { connect } from 'react-redux';
import {
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  toggleOnlyShowHeaders,
  clearAllSelectedSubmissions,
  clearAllSubmissions,
  toggleStudentFlag
} from '../../../actions/classroomSessions';
import CLLobby from './lobby';
import CLStatic from './static';
import CLSingleAnswer from './singleAnswer';
import CLExit from './exit';
import { getParameterByName } from 'libs/getParameterByName';
import {
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  ClassroomLessonSession
} from '../interfaces';
import {
  ClassroomLesson
} from 'interfaces/classroomLessons';

class CurrentSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.toggleOnlyShowHeaders = this.toggleOnlyShowHeaders.bind(this);
    this.toggleStudentFlag = this.toggleStudentFlag.bind(this);
    this.clearAllSelectedSubmissions = this.clearAllSelectedSubmissions.bind(this);
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const element = document.getElementsByClassName("main-content")[0];
    if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
      element.scrollTop = 0;
    }
  }

  toggleSelected(currentSlideId: string, student: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlideId] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      if (!currentValue) {
        saveSelectedStudentSubmission(caId, currentSlideId, student);
      } else {
        removeSelectedStudentSubmission(caId, currentSlideId, student);
      }
    }
  }

  clearAllSelectedSubmissions(currentSlide: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      clearAllSelectedSubmissions(caId, currentSlide);
    }
  }

  clearAllSubmissions(currentSlide: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      clearAllSubmissions(caId, currentSlide);
    }
  }

  toggleOnlyShowHeaders() {
    this.props.dispatch(toggleOnlyShowHeaders());
  }

  startDisplayingAnswers() {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      setMode(caId, this.props.classroomSessions.data.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      removeMode(caId, this.props.classroomSessions.data.current_slide);
    }
  }

  toggleStudentFlag(student_id: 'string') {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    toggleStudentFlag(ca_id, student_id);
  }

  render() {
    const data: ClassroomLessonSession = this.props.classroomSessions.data;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    if (this.props.classroomSessions.hasreceiveddata && lessonDataLoaded) {
      const current = lessonData.questions[parseInt(data.current_slide) || 0];
      switch (current.type) {
        case 'CL-LB':
          return (
            <CLLobby data={data} slideData={current} />
          );
        case 'CL-ST':
          return (
            <CLStatic
              data={data}
              lessonData={lessonData}
              toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
              onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
            />
          );
        case 'CL-SA':
        case 'CL-FB':
          return (
            <CLSingleAnswer
              data={data}
              lessonData={lessonData}
              toggleStudentFlag={this.toggleStudentFlag}
              toggleSelected={this.toggleSelected}
              startDisplayingAnswers={this.startDisplayingAnswers}
              stopDisplayingAnswers={this.stopDisplayingAnswers}
              toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
              clearAllSelectedSubmissions={this.clearAllSelectedSubmissions}
              clearAllSubmissions={this.clearAllSubmissions}
              onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
            />
          )
        case 'CL-FL':
        return (
          <CLSingleAnswer
            data={data}
            lessonData={lessonData}
            toggleStudentFlag={this.toggleStudentFlag}
            toggleSelected={this.toggleSelected}
            startDisplayingAnswers={this.startDisplayingAnswers}
            stopDisplayingAnswers={this.stopDisplayingAnswers}
            toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
            clearAllSelectedSubmissions={this.clearAllSelectedSubmissions}
            clearAllSubmissions={this.clearAllSubmissions}
            onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
          />
        )
        case 'CL-EX':
          return (
            <CLExit
              script={current.data.teach.script}
              flaggedStudents={data.flaggedStudents}
              students={data.students}
              toggleStudentFlag={this.toggleStudentFlag}
            />
          );
        case 'CL-EX':
          return (
            <CLExit
              script={current.data.teach.script}
              flaggedStudents={data.flaggedStudents}
              students={data.students}
              toggleStudentFlag={this.toggleStudentFlag}
            />
          );
        default:
          return (
            <p>UNSUPPORTED QUESTION TYPE</p>
          )
      }
    } else {
      return <p>Loading...</p>;
    }
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson : props.classroomLesson,
  };
}

export default connect(select)(CurrentSlide);
