import * as React from 'react';
import { connect } from 'react-redux';
import WakeLock from 'react-wakelock-react16'
import {
  startListeningToSession,
  registerPresence,
  updateNoStudentError,
  easyJoinLessonAddName,
  goToNextSlide,
  goToPreviousSlide,
  saveStudentSubmission
} from '../../../actions/classroomSessions';
import CLAbsentTeacher from './absentTeacher';
import CLStudentLobby from './lobby';
import CLWatchTeacher from './watchTeacher'
import CLStudentStatic from './static';
import CLStudentSingleAnswer from './singleAnswer';
import CLListBlanks from './listBlanks';
import CLStudentFillInTheBlank from './fillInTheBlank';
import CLStudentModelQuestion from './modelQuestion';
import CLMultistep from './multistep';
import ProjectorModal from './projectorModal';
import FollowUp from './followUp';
import ErrorPage from '../shared/errorPage';
import FlaggedStudentCompletedPage from './flaggedStudentCompleted';
import NavBar from '../../navbar/studentNavbar';

import { getClassLesson } from '../../../actions/classroomLesson';
import { getEditionQuestions } from '../../../actions/customize';
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  ClassroomSessionId
} from '../interfaces';
import { ClassroomLesson } from '../../../interfaces/classroomLessons';
import * as CustomizeIntf from '../../../interfaces/customize';
import { scriptTagStrip } from '../shared/scriptTagStrip';

import { Spinner } from 'quill-component-library/dist/componentLibrary';

const arrowSrc = `${process.env.CDN_URL}/images/icons/chevron-arrow-filled.svg`

class PlayClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const { match, } = props

    const classroomUnitId = getParameterByName('classroom_unit_id')
    const activityUid = match.params.lessonID
    this.state = {
      easyDemoName: '',
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    if (getParameterByName('projector')) {
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    if (!activityUid) {
      const classroom_unit_id = getParameterByName('classroom_unit_id');
      const lessonID = getParameterByName('uid');
      document.title = 'Quill Lessons';
      const student = getParameterByName('student');
      if (lessonID) {
        document.location.href = `${document.location.origin + document.location.pathname}#/play/class-lessons/${lessonID}?student=${student}&classroom_unit_id=${classroom_unit_id}`;
      }
    }
  }

  componentDidMount() {
    const { dispatch, } = this.props
    const { classroomSessionId, } = this.state
    if (classroomSessionId) {
      dispatch(startListeningToSession(classroomSessionId));
    }
    document.getElementsByTagName("html")[0].style.backgroundColor = "white";
    this.setInitialData(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    this.setInitialData(nextProps)
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].style.backgroundColor = "whitesmoke";
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  setInitialData = (props) => {
    const { match, dispatch, classroomSessions, } = this.props
    const { projector, } = this.state
    const { data, hasreceiveddata } = classroomSessions;
    const lessonId: string = match.params.lessonID
    if (props.classroomSessions.hasreceiveddata) {
      if (props.classroomSessions.data.edition_id && Object.keys(props.customize.editionQuestions).length < 1) {
        dispatch(getEditionQuestions(props.classroomSessions.data.edition_id))
      }
      if (!props.classroomLesson.hasreceiveddata) {
        dispatch(getClassLesson(lessonId));
      }
      if (props.classroomSessions.data.edition_id !== data.edition_id) {
        dispatch(getEditionQuestions(props.classroomSessions.data.edition_id))
      }
    }
    if (!props.classroomSessions.error && !props.classroomLesson.error) {
      const element = document.getElementsByClassName("main-content")[0];
      if (element && (props.classroomSessions.data.current_slide !== data.current_slide)) {
        element.scrollTop = 0;
      }
      const student = getParameterByName('student');
      const { classroomSessionId } = this.state
      const projectorFromParam = getParameterByName('projector')
      if (projectorFromParam === "true") {
        document.title = 'Quill Lessons | Projector Mode'
        if (!projector) {
          this.setState({projector: true, showProjectorModal: true})
        }
      } else if (classroomSessionId && student && hasreceiveddata && this.studentEnrolledInClass(student)) {
        registerPresence(classroomSessionId, student);
      } else {
        if (hasreceiveddata && !this.studentEnrolledInClass(student) && !props.classroomSessions.error) {
          if (props.classroomSessions.data.public) {
            this.setState({shouldEnterName: true})
          } else {
            dispatch(updateNoStudentError(student))
          }
        }
      }
    }
  }

  handleClickRightButton = () => {
    const { classroomSessionId, } = this.state
    const { dispatch, classroomSessions, customize, } = this.props
    const sessionData: ClassroomLessonSession = classroomSessions.data;
    const editionData: CustomizeIntf.EditionQuestions = customize.editionQuestions;
    dispatch(goToNextSlide(sessionData, editionData, classroomSessionId))
  }

  handleClickLeftButton = () => {
    const { classroomSessionId, } = this.state
    const { dispatch, classroomSessions, customize, } = this.props
    const sessionData: ClassroomLessonSession = classroomSessions.data;
    const editionData: CustomizeIntf.EditionQuestions = customize.editionQuestions;
    dispatch(goToPreviousSlide(sessionData, editionData, classroomSessionId))
  }


  handleKeyDown(event) {
    const { classroomSessionId, } = this.state
    const { classroomSessions, customize, dispatch, } = this.props
    const tag = event.target.tagName.toLowerCase()
    const className = event.target.className.toLowerCase()
    if (tag !== 'input' && tag !== 'textarea' && className.indexOf("drafteditor") === -1 && (event.keyCode === 39 || event.keyCode === 37)) {
      const sessionData: ClassroomLessonSession = classroomSessions.data;
      const editionData: CustomizeIntf.EditionQuestions = customize.editionQuestions;
      if (classroomSessionId) {
        const updateInStore = event.keyCode === 39
          ? goToNextSlide(sessionData, editionData, classroomSessionId)
          : goToPreviousSlide(sessionData, editionData, classroomSessionId)
        if (updateInStore) {
          dispatch(updateInStore);
        }
      }
    }
  }



  studentEnrolledInClass(student: string|null) {
    const { classroomSessions, } = this.props
    return student && classroomSessions.data.students ? !!classroomSessions.data.students[student] : false
  }

  onStudentSubmission = (data: string) => {
    const { classroomSessionId, } = this.state
    const { classroomSessions, } = this.props
    const student: string|null = getParameterByName('student');
    const currentSlide: string = classroomSessions.data.current_slide;
    const safeData = scriptTagStrip(data)
    const submission = {data: safeData}
    if (classroomSessionId && student && this.studentEnrolledInClass(student)) {
      saveStudentSubmission(
        classroomSessionId,
        currentSlide,
        student,
        submission
      );
    }
  }

  renderProjectorModal() {
    const { projector, showProjectorModal, } = this.state
    if (!(projector && showProjectorModal)) { return }

    return <ProjectorModal closeModal={this.hideProjectorModal} />
  }

  hideProjectorModal = () => {
    this.setState({showProjectorModal: false})
  }

  renderCurrentSlide(data: ClassroomLessonSession, lessonData: ClassroomLesson, editionData: CustomizeIntf.EditionQuestions) {
    const { projector, } = this.state
    const current = editionData.questions[data.current_slide];
    const prompt = data.prompts && data.prompts[data.current_slide] ? data.prompts[data.current_slide] : null;
    const model: string|null = data.models && data.models[data.current_slide] ? data.models[data.current_slide] : null;
    const mode: string|null = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : null;
    const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : null;
    const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : null;
    const selected_submission_order = data.selected_submission_order && data.selected_submission_order[data.current_slide] ? data.selected_submission_order[data.current_slide] : null;
    const studentCount = data.presence && Object.keys(data.presence) ? Object.keys(data.presence).length : 0
    const props = { mode, submissions, selected_submissions, selected_submission_order, projector, studentCount};
    let slide
    switch (current.type) {
      case 'CL-LB':
        slide = <CLStudentLobby data={data} key={data.current_slide} projector={projector} title={lessonData.title} />
        break
      case 'CL-ST':
        slide = <CLStudentStatic data={current.data} key={data.current_slide} />
        break
      case 'CL-MD':
        slide = <CLStudentModelQuestion data={current.data} key={data.current_slide} model={model} projector={projector} prompt={prompt} />
        break
      case 'CL-SA':
        slide = <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.onStudentSubmission} key={data.current_slide} {...props} />
        break
      case 'CL-FB':
        slide = <CLStudentFillInTheBlank data={current.data} handleStudentSubmission={this.onStudentSubmission} key={data.current_slide} {...props} />
        break
      case 'CL-FL':
        slide = <CLListBlanks data={current.data} handleStudentSubmission={this.onStudentSubmission} key={data.current_slide} {...props} />
        break
      case 'CL-MS':
        slide = <CLMultistep data={current.data} handleStudentSubmission={this.onStudentSubmission} key={data.current_slide} {...props} />
        break
      case 'CL-EX':
        slide = <CLStudentStatic data={current.data} key={data.current_slide} />
        break
      default:

    }
    return (<div>
      {this.renderProjectorModal()}
      {slide}
    </div>)
  }

  handleChange = (e) => {
    this.setState({
      easyDemoName: e.target.value
    })
  }

  handleClickJoinDemo = () => {
    const { classroomSessionId, easyDemoName, } = this.state
    if (classroomSessionId) {
      easyJoinLessonAddName(classroomSessionId, easyDemoName)
    }
  }

  renderLeftButton() {
    const { classroomSessions, } = this.props
    const currentSlide = Number(classroomSessions.data.current_slide)
    if (!getParameterByName('projector') || currentSlide === 0) { return }
    return (<button
      className="projector-navigation-button left"
      onClick={this.handleClickLeftButton}
      type="button"
    >
      <img
        alt="Arrow pointing left in circle"
        className="left-button"
        src={arrowSrc}
      />
    </button>)
  }

  renderRightButton() {
    const { classroomSessions, customize,  } = this.props
    const currentSlide = Number(classroomSessions.data.current_slide)
    if (!getParameterByName('projector') || currentSlide === customize.editionQuestions.questions.length - 1) { return }
    return (<button
      className="projector-navigation-button right"
      onClick={this.handleClickRightButton}
      type="button"
    >
      <img
        alt="Arrow pointing right"
        src={arrowSrc}
      />
    </button>)
  }

  public render() {
    const { classroomLesson, classroomSessions, customize, } = this.props
    const { shouldEnterName, easyDemoName, flaggedStudentCompletionScreen, projector, } = this.state
    const { data, hasreceiveddata, error }: { data: ClassroomLessonSession, hasreceiveddata: boolean, error: string } = classroomSessions;

    if (data.followUpOption) {
      const student = getParameterByName('student') || '';
      const isFlagged = data.flaggedStudents && Object.keys(data.flaggedStudents).includes(student)
      return <FollowUp followUpOption={data.followUpOption} followUpUrl={data.followUpUrl} isFlagged={isFlagged} />
    }

    const lessonError = classroomLesson.error;
    const navbar = Number(classroomSessions.data.current_slide) === 0 ? null : <NavBar />
    let mainContent = (
      <div>
        <Spinner />
      </div>
    );

    if (shouldEnterName) {
       mainContent = (
         <div>
           <div className="play-lesson-container">
             <div className="main-content">
               <div className="main-content-wrapper">
                 <div className="easy-join-name-form-wrapper">
                   <div className="easy-join-name-form">
                     <p>Please enter your full name:</p>
                     <input aria-label="Full name" onChange={this.handleChange} value={easyDemoName} />
                     <button onClick={this.handleClickJoinDemo} type="button">Join</button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
      )
    } else if (error) {
       mainContent = <ErrorPage text={error} />
     } else if (lessonError) {
       mainContent = <ErrorPage text={lessonError} />
     } else if (flaggedStudentCompletionScreen) {
       mainContent = <FlaggedStudentCompletedPage />
     } else {
       const lessonData: ClassroomLesson = classroomLesson.data;
       const lessonDataLoaded: boolean = classroomLesson.hasreceiveddata;
       const editionData: CustomizeIntf.EditionQuestions = customize.editionQuestions;
       const editionDataLoaded: boolean = Object.keys(editionData).length > 0;
       // const data: ClassroomLessonSessions  = classroomSessions.data;
       // const hasreceiveddata = classroomSessions.hasreceiveddata
       const absentTeacher = classroomSessions.data.absentTeacherState ? <CLAbsentTeacher /> : null
       const watchTeacher = classroomSessions.data.watchTeacherState && !projector ? <CLWatchTeacher /> : null

       if (hasreceiveddata && lessonDataLoaded && editionDataLoaded) {
         const component = this.renderCurrentSlide(data, lessonData, editionData);
         if (component) {
           mainContent = (
             <div>
               <WakeLock />
               {absentTeacher || watchTeacher}
               {this.renderLeftButton()}
               <div className="play-lesson-container">
                 <div className="main-content">
                   <div className="main-content-wrapper">
                     {component}
                   </div>
                 </div>
               </div>
               {this.renderRightButton()}
             </div>
           );
         }
       }
     }
     return (<div>
       {navbar}
       <div id="main-content" tabIndex={-1}>{mainContent}</div>
     </div>)
   }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(PlayClassroomLessonContainer);
