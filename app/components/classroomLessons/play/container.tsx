import * as React from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions';
import CLStudentLobby from './lobby';
import CLWatchTeacher from './watchTeacher'
import CLStudentStatic from './static';
import CLStudentSingleAnswer from './singleAnswer';
import CLListBlanks from './listBlanks';
import { saveStudentSubmission } from '../../../actions/classroomSessions';
import { getClassLessonFromFirebase } from '../../../actions/classroomLesson';
import { getParameterByName } from 'libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList
} from '../interfaces';
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'

class PlayLessonClassroomContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this);
  }

  componentDidMount() {
    const classroom_activity_id = getParameterByName('classroom_activity_id');
    const student = getParameterByName('student');
    if (classroom_activity_id) {
      this.props.dispatch(startListeningToSession(classroom_activity_id));
      this.props.dispatch(getClassLessonFromFirebase(this.props.params.lessonID));
      if (student) {
        registerPresence(classroom_activity_id, student);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const element = document.getElementsByClassName("main-content")[0];
    if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
      element.scrollTop = 0;
    }
  }

  handleStudentSubmission(data: string, timestamp: string) {
    const classroom_activity_id: string|null = getParameterByName('classroom_activity_id');
    const student: string|null = getParameterByName('student');
    const current_slide: string = this.props.classroomSessions.data.current_slide;
    const submission = {data, timestamp}
    if (classroom_activity_id && student) {
      saveStudentSubmission(
        classroom_activity_id,
        current_slide,
        student,
        submission
      );
    }
  }

  renderCurrentSlide(data: ClassroomLessonSession, lessonData: ClassroomLesson) {
    const current = lessonData.questions[data.current_slide];
    const mode: string|null = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : null;
    const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : null;
    const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : null;
    const props = { mode, submissions, selected_submissions, };
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLStudentLobby data={data} title={lessonData.title}/>
        );
      case 'CL-ST':
        return (
          <CLStudentStatic data={current.data} />
        );
      case 'CL-SA':
        return (
          <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
        );
      case 'CL-FL':
        return (
          <CLListBlanks data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props}/>
        );
      default:

    }
  }

  public render() {
    const { data, hasreceiveddata }: { data: ClassroomLessonSession, hasreceiveddata: boolean } = this.props.classroomSessions;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    // const data: ClassroomLessonSessions  = this.props.classroomSessions.data;
    // const hasreceiveddata = this.props.classroomSessions.hasreceiveddata
    const watchTeacher = this.props.classroomSessions.data.watchTeacherState ? <CLWatchTeacher /> : null
    if (hasreceiveddata && lessonDataLoaded) {
      const component = this.renderCurrentSlide(data, lessonData);
      if (component) {
        return (
          <div>
            {watchTeacher}
            <div className="play-lesson-container">
              <div className="main-content">
                <div className="main-content-wrapper">
                  {component}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        Loading...
      </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(PlayLessonClassroomContainer);
