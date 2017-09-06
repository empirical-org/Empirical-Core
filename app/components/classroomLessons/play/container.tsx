import * as React from 'react';
import { connect } from 'react-redux';
import WakeLock from 'react-wakelock';
import {
  startListeningToSession,
  registerPresence,
  updateNoStudentError,
  easyJoinLessonAddName,
  goToNextSlide,
  goToPreviousSlide
} from '../../../actions/classroomSessions';
import CLAbsentTeacher from './absentTeacher';
import CLStudentLobby from './lobby';
import CLWatchTeacher from './watchTeacher'
import CLStudentStatic from './static';
import CLStudentSingleAnswer from './singleAnswer';
import CLListBlanks from './listBlanks';
import CLStudentFillInTheBlank from './fillInTheBlank';
import CLStudentModelQuestion from './modelQuestion';
import CLExit from './exit';
import ProjectorModal from './projectorModal'
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
import Spinner from 'components/shared/spinner'

class PlayLessonClassroomContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      easyDemoName: ''
    }

    if (getParameterByName('projector')) {
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }


    this.handleStudentSubmission = this.handleStudentSubmission.bind(this);
    this.easyJoinDemo = this.easyJoinDemo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideProjectorModal = this.hideProjectorModal.bind(this)
  }

  componentDidMount() {
    const classroom_activity_id = getParameterByName('classroom_activity_id');
    const student = getParameterByName('student');
    if (classroom_activity_id) {
      this.props.dispatch(startListeningToSession(classroom_activity_id));
      this.props.dispatch(getClassLessonFromFirebase(this.props.params.lessonID));
    }
    document.getElementsByTagName("html")[0].style.backgroundColor = "white";
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].style.backgroundColor = "whitesmoke";
  }

  componentWillReceiveProps(nextProps, nextState) {
    const student = getParameterByName('student');
    const npCSData = nextProps.classroomSessions.data
    if (npCSData.assignedStudents && npCSData.assignedStudents.includes(student) && npCSData.followUpUrl) {
      window.location.href = npCSData.followUpUrl
    }
    if (!nextProps.classroomSessions.error && !nextProps.classroomLesson.error) {
      const element = document.getElementsByClassName("main-content")[0];
      if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
        element.scrollTop = 0;
      }
      const student = getParameterByName('student');
      const classroom_activity_id = getParameterByName('classroom_activity_id')
      const projector = getParameterByName('projector')
      const { data, hasreceiveddata } = this.props.classroomSessions;
      if (projector === "true") {
        if (!this.state.projector) {
          this.setState({projector: true, showProjectorModal: true})
        }
      } else if (classroom_activity_id && student && hasreceiveddata && this.studentEnrolledInClass(student)) {
        registerPresence(classroom_activity_id, student);
      } else {
        if (hasreceiveddata && !this.studentEnrolledInClass(student) && !nextProps.classroomSessions.error) {
          if (nextProps.classroomSessions.data.public) {
            this.setState({shouldEnterName: true})
          } else {
            this.props.dispatch(updateNoStudentError(student))
          }
        }
      }
    }
  }

  handleKeyDown(event) {
    const tag = event.target.tagName.toLowerCase()
    const className = event.target.className.toLowerCase()
    if (tag !== 'input' && tag !== 'textarea' && className.indexOf("drafteditor") === -1 && (event.keyCode === 39 || event.keyCode === 37)) {
      const ca_id: string|null = getParameterByName('classroom_activity_id');
      const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
      const lessonData: ClassroomLesson = this.props.classroomLesson.data;
      if (ca_id) {
        const updateInStore = event.keyCode === 39
          ? goToNextSlide(ca_id, sessionData, lessonData)
          : goToPreviousSlide(ca_id, sessionData, lessonData)
        if (updateInStore) {
          this.props.dispatch(updateInStore);
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

  renderProjectorModal() {
    if (this.state.projector && this.state.showProjectorModal) {
      return <ProjectorModal closeModal={this.hideProjectorModal} />
    }
  }

  hideProjectorModal() {
    this.setState({showProjectorModal: false})
  }

  renderCurrentSlide(data: ClassroomLessonSession, lessonData: ClassroomLesson) {
    const current = lessonData.questions[data.current_slide];
    const prompt = data.prompts && data.prompts[data.current_slide] ? data.prompts[data.current_slide] : null;
    const model: string|null = data.models && data.models[data.current_slide] ? data.models[data.current_slide] : null;
    const mode: string|null = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : null;
    const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : null;
    const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : null;
    const selected_submission_order = data.selected_submission_order && data.selected_submission_order[data.current_slide] ? data.selected_submission_order[data.current_slide] : null;
    const projector = this.state.projector
    const props = { mode, submissions, selected_submissions, selected_submission_order, projector};
    let slide
    switch (current.type) {
      case 'CL-LB':
        slide = <CLStudentLobby key={data.current_slide} data={data} title={lessonData.title}/>
        break
      case 'CL-ST':
        slide = <CLStudentStatic key={data.current_slide} data={current.data} />
        break
      case 'CL-MD':
        slide = <CLStudentModelQuestion key={data.current_slide} data={current.data} model={model} prompt={prompt}/>
        break
      case 'CL-SA':
        slide = <CLStudentSingleAnswer key={data.current_slide} data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
        break
      case 'CL-FB':
        slide = <CLStudentFillInTheBlank key={data.current_slide} data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
        break
      case 'CL-FL':
        slide = <CLListBlanks key={data.current_slide} data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props}/>
        break
      case 'CL-EX':
        slide = <CLStudentStatic key={data.current_slide} data={current.data} />
        break
      default:

    }
    return <div>
      {this.renderProjectorModal()}
      {slide}
    </div>
  }

  handleChange(e) {
    console.log("event: ", e)
    this.setState({
      easyDemoName: e.target.value
    })
  }

  easyJoinDemo() {
    console.log("Joining", this.state)
    const classroom_activity_id: string|null = getParameterByName('classroom_activity_id');
    if (classroom_activity_id) {
      easyJoinLessonAddName(classroom_activity_id, this.state.easyDemoName)
    }
  }

  public render() {
    const { data, hasreceiveddata, error }: { data: ClassroomLessonSession, hasreceiveddata: boolean, error: string } = this.props.classroomSessions;
    const lessonError = this.props.classroomLesson.error;
    if (this.state.shouldEnterName) {
      return (
        <div>
        <div className="play-lesson-container">
        <div className="main-content">
        <div className="main-content-wrapper">
        <div className="easy-join-name-form-wrapper">
        <div className="easy-join-name-form">
        <p>Please enter your full name:</p>
        <input value={this.state.easyDemoName} onChange={this.handleChange}/>
        <button onClick={this.easyJoinDemo}>Join</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
      )
    } else if (error) {
       return <ErrorPage text={error} />
     } else if (lessonError) {
       return <ErrorPage text={lessonError} />
     } else {
       const lessonData: ClassroomLesson = this.props.classroomLesson.data;
       const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
       // const data: ClassroomLessonSessions  = this.props.classroomSessions.data;
       // const hasreceiveddata = this.props.classroomSessions.hasreceiveddata
       const absentTeacher = this.props.classroomSessions.data.absentTeacherState ? <CLAbsentTeacher /> : null
       const watchTeacher = this.props.classroomSessions.data.watchTeacherState && !this.state.projector ? <CLWatchTeacher /> : null

       if (hasreceiveddata && lessonDataLoaded) {
         const component = this.renderCurrentSlide(data, lessonData);
         if (component) {
           return (
             <div>
              <WakeLock />
              {absentTeacher || watchTeacher}
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
         <Spinner/>
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
