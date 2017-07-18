import * as React from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  registerPresence,
  updateNoStudentError,
} from '../../../actions/classroomSessions';
import CLStudentLobby from './lobby';
import CLWatchTeacher from './watchTeacher'
import CLStudentStatic from './static';
import CLStudentSingleAnswer from './singleAnswer';
import CLListBlanks from './listBlanks';
import CLStudentFillInTheBlank from './fillInTheBlank'
import ErrorPage from '../shared/errorPage'
import { saveStudentSubmission } from '../../../actions/classroomSessions';
import { getClassLessonFromFirebase } from '../../../actions/classroomLesson';
import { getParameterByName } from 'libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
} from '../interfaces';
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons';
import {
  scriptTagStrip
} from '../shared/scriptTagStrip';

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
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.classroomSessions.error && !nextProps.classroomLesson.error) {
      const element = document.getElementsByClassName("main-content")[0];
      if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
        element.scrollTop = 0;
      }
      const student = getParameterByName('student');
      const classroom_activity_id = getParameterByName('classroom_activity_id')
      const { data, hasreceiveddata } = this.props.classroomSessions;
      if (classroom_activity_id && student && hasreceiveddata && this.studentEnrolledInClass(student)) {
        registerPresence(classroom_activity_id, student);
      } else {
        if (hasreceiveddata && !this.studentEnrolledInClass(student) && !nextProps.classroomSessions.error) {
          this.props.dispatch(updateNoStudentError(student))
        }
      }
    }
  }

  studentEnrolledInClass(student: string|null) {
    return student ? !!this.props.classroomSessions.data.students[student] : false
  }

  handleStudentSubmission(data: string, timestamp: string) {
    const classroom_activity_id: string|null = getParameterByName('classroom_activity_id');
    const student: string|null = getParameterByName('student');
    const current_slide: string = this.props.classroomSessions.data.current_slide;
    const safeData = scriptTagStrip(data)
    const submission = {data: safeData, timestamp}
    if (classroom_activity_id && student && this.studentEnrolledInClass(student)) {
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
    let passedProps;
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
        passedProps = { mode, submissions, selected_submissions, };
        return (
          <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...passedProps} />
        );
      case 'CL-FB':
        passedProps = { mode, submissions, selected_submissions, };
        return (
          <CLStudentFillInTheBlank data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...passedProps} />
        );
      case 'CL-FL':
        return (
          <CLListBlanks data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props}/>
        );
      default:

    }
  }

  public render() {
    const { data, hasreceiveddata, error }: { data: ClassroomLessonSession, hasreceiveddata: boolean, error: string } = this.props.classroomSessions;
    const lessonError = this.props.classroomLesson.error;
    if (error) {
     return <ErrorPage text={error} />
   } else if (lessonError) {
     return <ErrorPage text={lessonError} />
   } else {
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

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(PlayLessonClassroomContainer);
