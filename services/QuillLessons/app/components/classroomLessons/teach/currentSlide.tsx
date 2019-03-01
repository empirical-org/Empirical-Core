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
  toggleStudentFlag,
  setModel,
  removeStudentSubmission,
  redirectAssignedStudents,
  updateStudentSubmissionOrder,
  setPrompt,
  hideSignupModal,
  finishActivity
} from '../../../actions/classroomSessions';
import { Spinner } from 'quill-component-library/dist/componentLibrary';
import CLLobby from './lobby';
import CLStatic from './static';
import CLSingleAnswer from './singleAnswer';
import CLExit from './exit';
import PreviewModal from './previewModal'
import TimeoutModal from './timeoutModal'
import CongratulationsModal from './congratulationsModal'
import SignupModal from './signupModal'
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  ClassroomLessonSession,
  ClassroomSessionId,
  ClassroomUnitId
} from '../interfaces';
import {
  ClassroomLesson,
  ScriptItem
} from '../../../interfaces/classroomLessons';
import * as CustomizeIntf from '../../../interfaces/customize'
import {generate} from '../../../libs/conceptResults/classroomLessons.js';
import { Lesson, Edition } from './dataContainer';
import { TeacherReducer } from '../../../reducers/teacher';

interface CurrentSlideProps {
  params: any,
  [key:string]: any
  lesson: Lesson
  edition: Edition
  session: ClassroomLessonSession
}

class CurrentSlide extends React.Component<CurrentSlideProps & StateFromProps, any> {
  constructor(props) {
    super(props);

    const data: ClassroomLessonSession = props.session;
    const lessonData: Lesson = props.lesson;
    const edition: Edition = props.edition;
    const script: Array<ScriptItem> =  edition.questions[data.current_slide || "0"].data.teach.script || []
    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.params.lessonID

    this.state = {
      numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      numberOfToggledHeaders: 0,
      showPreviewModal: getParameterByName('modal'),
      showTimeoutModal: false,
      showCongratulationsModal: false,
      completed: false,
      selectedOptionKey: data.followUpActivityName ? "Small Group Instruction and Independent Practice" : '',
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.toggleOnlyShowHeaders = this.toggleOnlyShowHeaders.bind(this);
    this.toggleStudentFlag = this.toggleStudentFlag.bind(this);
    this.clearAllSelectedSubmissions = this.clearAllSelectedSubmissions.bind(this);
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this);
    this.saveModel = this.saveModel.bind(this);
    this.savePrompt = this.savePrompt.bind(this);
    this.updateToggledHeaderCount = this.updateToggledHeaderCount.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this)
    this.closeTimeoutModal = this.closeTimeoutModal.bind(this)
    this.closeCongratulationsModal = this.closeCongratulationsModal.bind(this)
    this.closeSignupModal = this.closeSignupModal.bind(this)
    this.openStudentView = this.openStudentView.bind(this)
    this.finishLesson = this.finishLesson.bind(this)
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
    this.timeOut = this.timeOut.bind(this)
  }

  componentDidMount() {
    setTimeout(this.timeOut, 43200000)
  }

  componentWillReceiveProps(nextProps) {
    const element = document.getElementsByClassName("main-content")[0];
    if (element && (nextProps.session.current_slide !== this.props.session.current_slide)) {
      element.scrollTop = 0;
    }
    if (nextProps.session && nextProps.edition) {
      const data: ClassroomLessonSession = nextProps.session;
      const editionData: CustomizeIntf.EditionQuestions = nextProps.edition;
      const script: Array<ScriptItem> = editionData && editionData.questions && editionData.questions[data.current_slide] ? editionData.questions[data.current_slide].data.teach.script : []
      this.setState({
        numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      })
    }
  }

  toggleSelected(currentSlideId: string, student: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      const submissions: SelectedSubmissions | null = this.props.session.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlideId] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      updateStudentSubmissionOrder(classroomSessionId, currentSlideId, student)
      if (!currentValue) {
        saveSelectedStudentSubmission(classroomSessionId, currentSlideId, student);
      } else {
        removeSelectedStudentSubmission(classroomSessionId, currentSlideId, student);
      }
    }
  }

  clearAllSelectedSubmissions(currentSlide: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      clearAllSelectedSubmissions(classroomSessionId, currentSlide);
    }
  }

  clearAllSubmissions(currentSlide: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      clearAllSubmissions(classroomSessionId, currentSlide);
    }
  }

  clearStudentSubmission(currentSlideId: string, student: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      removeStudentSubmission(classroomSessionId, currentSlideId, student);
    }
  }

  toggleOnlyShowHeaders() {
    this.props.dispatch(toggleOnlyShowHeaders());
  }

  startDisplayingAnswers() {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      setMode(classroomSessionId, this.props.session.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      removeMode(classroomSessionId, this.props.session.current_slide);
    }
  }

  toggleStudentFlag(studentId: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    toggleStudentFlag(classroomSessionId, studentId);
  }

  saveModel(model: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      setModel(classroomSessionId, this.props.session.current_slide, model);
    }
  }

  updateToggledHeaderCount(change: number) {
    this.setState({numberOfToggledHeaders: this.state.numberOfToggledHeaders + change}, () => {
      if (this.state.numberOfHeaders === this.state.numberOfToggledHeaders) {
        this.setState({numberOfToggledHeaders: 0})
        this.toggleOnlyShowHeaders()
      }
    })
  }

  savePrompt(prompt: string) {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    if (classroomSessionId) {
      setPrompt(classroomSessionId, this.props.session.current_slide, prompt);
    }
  }

  closePreviewModal() {
    this.setState({showPreviewModal: false})
  }

  closeTimeoutModal() {
    this.setState({showTimeoutModal: false})
  }

  closeCongratulationsModal() {
    this.setState({showCongratulationsModal: false})
  }

  closeSignupModal() {
    this.props.dispatch(hideSignupModal())
  }

  openStudentView() {
    const studentUrl: string = window.location.href.replace('teach', 'play')
    window.open(studentUrl, 'newwindow', `width=${window.innerWidth},height=${window.innerHeight}`)
    this.closePreviewModal()
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  finishLesson() {
    const questions = this.props.edition.questions;
    const submissions = this.props.session.submissions;
    const followUp = this.props.session.followUpActivityName && this.state.selectedOptionKey !== 'No Follow Up Practice';
    const activityId = this.props.params.lessonID;
    const classroomUnitId = this.state.classroomUnitId || '';
    const classroomSessionId = this.state.classroomSessionId || '';
    const conceptResults = generate(questions, submissions);
    const editionId: string|undefined = this.props.session.edition_id;

    finishActivity(followUp, conceptResults, editionId, activityId, classroomUnitId, (response) => {
      if (classroomSessionId) {
        redirectAssignedStudents(
          classroomSessionId,
          this.state.selectedOptionKey,
          response.follow_up_url
        );
      }
      this.setState({
        completed: true,
        showTimeoutModal: false,
        showCongratulationsModal: true
      });
    });
  }

  timeOut() {
    if (!this.props.session.preview) {
      this.setState({showTimeoutModal: true})
    }
  }

  renderPreviewModal() {
    if (this.state.showPreviewModal) {
      return <PreviewModal closeModal={this.closePreviewModal} openStudentView={this.openStudentView}/>
    }
  }

  renderTimeoutModal() {
    if (this.state.showTimeoutModal) {
      return <TimeoutModal
        finishLesson={this.finishLesson}
        closeModal={this.closeTimeoutModal}
      />
    }
  }

  renderCongratulationsModal() {
    if (this.state.showCongratulationsModal) {
      return <CongratulationsModal closeModal={this.closeCongratulationsModal} lessonId={this.props.lessonId} classroomSessionId={this.state.classroomSessionId}/>
    }
  }

  renderSignupModal() {
    if (this.props.teacher.showSignupModal) {
      return <SignupModal
        closeModal={this.closeSignupModal}
        lessonId={this.props.lessonId}
        goToSignup={() => window.location.href = `${process.env.EMPIRICAL_BASE_URL}/account/new`}
      />
    }
  }

  render() {
    const data: ClassroomLessonSession = this.props.session;
    const lessonData: ClassroomLesson = this.props.lesson;
    const editionData: CustomizeIntf.EditionQuestions = this.props.edition;
    const lessonId: string = this.props.params.lessonID;
    const lessonDataLoaded: boolean = true;
    const editionDataLoaded: boolean = editionData.questions && editionData.questions.length > 0
    if (data && lessonDataLoaded && editionDataLoaded) {
      const current = editionData.questions[parseInt(data.current_slide) || 0];
      let slide
      switch (current.type) {
        case 'CL-LB':
          slide = <CLLobby data={data} lessonData={lessonData} slideData={current} />
          break
        case 'CL-ST':
          slide = <CLStatic
              data={data}
              editionData={editionData}
              toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
              onlyShowHeaders={this.props.teacher.onlyShowHeaders}
              updateToggledHeaderCount={this.updateToggledHeaderCount}
            />
          break
        case 'CL-MD':
        case 'CL-SA':
        case 'CL-FB':
        case 'CL-FL':
        case 'CL-MS':
          slide = <CLSingleAnswer
              data={data}
              editionData={editionData}
              toggleStudentFlag={this.toggleStudentFlag}
              toggleSelected={this.toggleSelected}
              startDisplayingAnswers={this.startDisplayingAnswers}
              stopDisplayingAnswers={this.stopDisplayingAnswers}
              toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
              clearAllSelectedSubmissions={this.clearAllSelectedSubmissions}
              clearAllSubmissions={this.clearAllSubmissions}
              onlyShowHeaders={this.props.teacher.onlyShowHeaders}
              updateToggledHeaderCount={this.updateToggledHeaderCount}
              saveModel={this.saveModel}
              clearStudentSubmission={this.clearStudentSubmission}
              savePrompt={this.savePrompt}
            />
          break
        case 'CL-EX':
          slide = <CLExit
              data={data}
              editionData={editionData}
              selectedOptionKey={this.state.selectedOptionKey}
              updateSelectedOptionKey={this.updateSelectedOptionKey}
              script={current.data.teach.script}
              flaggedStudents={data.flaggedStudents}
              students={data.students}
              toggleStudentFlag={this.toggleStudentFlag}
              lessonId={lessonId}
              finishLesson={this.finishLesson}
              completed={this.state.completed}
              followUpActivityName={data.followUpActivityName}
            />
            break
        default:
          slide = <p>UNSUPPORTED QUESTION TYPE</p>
          break
      }
      return <div>
        {this.renderPreviewModal()}
        {this.renderTimeoutModal()}
        {this.renderCongratulationsModal()}
        {this.renderSignupModal()}
        {slide}
      </div>
    } else {
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
    teacher: props.teacher
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {

}

export interface StateFromProps {
  teacher: TeacherReducer
}

export default connect<StateFromProps, DispatchFromProps, CurrentSlideProps>(select, dispatch => ({dispatch}))(CurrentSlide);
