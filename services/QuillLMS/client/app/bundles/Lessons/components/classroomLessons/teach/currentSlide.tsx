import * as React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '../../../../Shared/index';
import {
  clearAllSelectedSubmissions,
  clearAllSubmissions, finishActivity, hideSignupModal, redirectAssignedStudents, removeMode, removeSelectedStudentSubmission, removeStudentSubmission, saveSelectedStudentSubmission, saveStudentSubmission, setMode, setModel, setPrompt, toggleOnlyShowHeaders, toggleStudentFlag, updateStudentSubmissionOrder
} from '../../../actions/classroomSessions';
import {
  SMALL_GROUP_AND_INDEPENDENT
} from '../../constants';
import CongratulationsModal from './congratulationsModal';
import CLExit from './exit';
import CLLobby from './lobby';
import PreviewModal from './previewModal';
import SignupModal from './signupModal';
import CLSingleAnswer from './singleAnswer';
import CLStatic from './static';
import TimeoutModal from './timeoutModal';

import {
  ClassroomLesson,
  ScriptItem
} from '../../../interfaces/classroomLessons';
import * as CustomizeIntf from '../../../interfaces/customize';
import { generate } from '../../../libs/conceptResults/classroomLessons.js';
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  ClassroomLessonSession,
  ClassroomSessionId,
  ClassroomUnitId, SelectedSubmissions,
  SelectedSubmissionsForQuestion
} from '../interfaces';

interface CurrentSlideProps {
  params: any,
  [key:string]: any
}

class CurrentSlide extends React.Component<CurrentSlideProps & StateFromProps, any> {
  constructor(props) {
    super(props);

    const data: ClassroomLessonSession = props.classroomSessions.data;
    const lessonData: ClassroomLesson = props.classroomLesson.data;
    const script: Array<ScriptItem> = lessonData && lessonData.questions && lessonData.questions[data.current_slide] ? lessonData.questions[data.current_slide].data.teach.script : []
    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')

    this.state = {
      numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      numberOfToggledHeaders: 0,
      showPreviewModal: getParameterByName('modal'),
      showTimeoutModal: false,
      showCongratulationsModal: false,
      completed: false,
      selectedOptionKey: data.followUpActivityName ? SMALL_GROUP_AND_INDEPENDENT : '',
      classroomUnitId,
    }

    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.toggleOnlyShowHeaders = this.toggleOnlyShowHeaders.bind(this);
    this.toggleStudentFlag = this.toggleStudentFlag.bind(this);
    this.clearAllSelectedSubmissions = this.clearAllSelectedSubmissions.bind(this);
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this);
    this.clearStudentSubmission = this.clearStudentSubmission.bind(this)
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const element = document.getElementsByClassName("main-content")[0];
    if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
      element.scrollTop = 0;
    }
    if (nextProps.classroomSessions.hasreceiveddata && nextProps.classroomLesson.hasreceiveddata) {
      const data: ClassroomLessonSession = nextProps.classroomSessions.data;
      const editionData: CustomizeIntf.EditionQuestions = nextProps.customize.editionQuestions;
      const script: Array<ScriptItem> = editionData && editionData.questions && editionData.questions[data.current_slide] ? editionData.questions[data.current_slide].data.teach.script : []
      this.setState({
        numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      })
    }
  }

  classroomSessionId = () => {
    const { match, } = this.props
    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const { lessonID, } = match.params
    return classroomUnitId.concat(lessonID)
  }

  toggleSelected = (currentSlideId: string, student: string) => {
    const classroomSessionId = this.classroomSessionId()
    const { classroomSessions, } = this.props
    if (!classroomSessionId) { return }

    const submissions: SelectedSubmissions | null = classroomSessions.data.selected_submissions;
    const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlideId] : null;
    const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
    updateStudentSubmissionOrder(classroomSessionId, currentSlideId, student)
    if (!currentValue) {
      saveSelectedStudentSubmission(classroomSessionId, currentSlideId, student);
    } else {
      removeSelectedStudentSubmission(classroomSessionId, currentSlideId, student);
    }
  }

  clearAllSelectedSubmissions(currentSlide: string) {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      clearAllSelectedSubmissions(classroomSessionId, currentSlide);
    }
  }

  clearAllSubmissions(currentSlide: string) {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      clearAllSubmissions(classroomSessionId, currentSlide);
    }
  }

  clearStudentSubmission = (currentSlideId: string, student: string, submission?: string) => {
    const classroomSessionId = this.classroomSessionId()
    if (!classroomSessionId) { return }

    if (submission) {
      const submissionObj = { data: submission, }
      saveStudentSubmission(classroomSessionId, currentSlideId, student, submissionObj)
    } else {
      removeStudentSubmission(classroomSessionId, currentSlideId, student);
    }
  }

  toggleOnlyShowHeaders() {
    this.props.dispatch(toggleOnlyShowHeaders());
  }

  startDisplayingAnswers() {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      setMode(classroomSessionId, this.props.classroomSessions.data.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      removeMode(classroomSessionId, this.props.classroomSessions.data.current_slide);
    }
  }

  toggleStudentFlag(studentId: string) {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    toggleStudentFlag(classroomSessionId, studentId);
  }

  saveModel(model: string) {
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      setModel(classroomSessionId, this.props.classroomSessions.data.current_slide, model);
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
    const classroomSessionId: ClassroomSessionId|null = this.classroomSessionId();
    if (classroomSessionId) {
      setPrompt(classroomSessionId, this.props.classroomSessions.data.current_slide, prompt);
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
    const questions = this.props.customize.editionQuestions.questions;
    const submissions = this.props.classroomSessions.data.submissions;
    const followUp = this.props.classroomSessions.data.followUpActivityName && this.state.selectedOptionKey !== 'No Follow Up Practice';
    const activityId = this.props.classroomLesson.data.id;
    const classroomUnitId = this.state.classroomUnitId || '';
    const classroomSessionId = this.classroomSessionId() || '';
    const conceptResults = generate(questions, submissions);
    const editionId: string|undefined = this.props.classroomSessions.data.edition_id;

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
    if (!this.props.classroomSessions.data.preview) {
      this.setState({showTimeoutModal: true})
    }
  }

  renderPreviewModal() {
    if (this.state.showPreviewModal) {
      return <PreviewModal closeModal={this.closePreviewModal} openStudentView={this.openStudentView} />
    }
  }

  renderTimeoutModal() {
    if (this.state.showTimeoutModal) {
      return (
        <TimeoutModal
          closeModal={this.closeTimeoutModal}
          finishLesson={this.finishLesson}
        />
      )
    }
  }

  renderCongratulationsModal() {
    if (this.state.showCongratulationsModal) {
      return <CongratulationsModal classroomSessionId={this.classroomSessionId()} closeModal={this.closeCongratulationsModal} lessonId={this.props.lessonId} />
    }
  }

  renderSignupModal() {
    if (this.props.classroomSessions.showSignupModal) {
      return (
        <SignupModal
          closeModal={this.closeSignupModal}
          goToSignup={() => window.location.href = `${process.env.DEFAULT_URL}/account/new`}
          lessonId={this.props.lessonId}
        />
      )
    }
  }

  render() {
    const data: ClassroomLessonSession = this.props.classroomSessions.data;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const editionData: CustomizeIntf.EditionQuestions = this.props.customize.editionQuestions;
    const lessonId: string = this.props.classroomLesson.data.id
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    const editionDataLoaded: boolean = editionData.questions && editionData.questions.length > 0
    if (this.props.classroomSessions.hasreceiveddata && lessonDataLoaded && editionDataLoaded) {
      const current = editionData.questions[parseInt(data.current_slide) || 0];
      let slide
      switch (current.type) {
        case 'CL-LB':
          slide = <CLLobby data={data} lessonData={lessonData} slideData={current} />
          break
        case 'CL-ST':
          slide = (<CLStatic
            data={data}
            editionData={editionData}
            onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
            toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
            updateToggledHeaderCount={this.updateToggledHeaderCount}
          />)
          break
        case 'CL-MD':
        case 'CL-SA':
        case 'CL-FB':
        case 'CL-FL':
        case 'CL-MS':
          slide = (<CLSingleAnswer
            clearAllSelectedSubmissions={this.clearAllSelectedSubmissions}
            clearAllSubmissions={this.clearAllSubmissions}
            clearStudentSubmission={this.clearStudentSubmission}
            data={data}
            editionData={editionData}
            onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
            saveModel={this.saveModel}
            savePrompt={this.savePrompt}
            startDisplayingAnswers={this.startDisplayingAnswers}
            stopDisplayingAnswers={this.stopDisplayingAnswers}
            toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
            toggleSelected={this.toggleSelected}
            toggleStudentFlag={this.toggleStudentFlag}
            updateToggledHeaderCount={this.updateToggledHeaderCount}
          />)
          break
        case 'CL-EX':
          slide = (<CLExit
            completed={this.state.completed}
            data={data}
            editionData={editionData}
            finishLesson={this.finishLesson}
            flaggedStudents={data.flaggedStudents}
            followUpActivityName={data.followUpActivityName}
            lessonId={lessonId}
            script={current.data.teach.script}
            selectedOptionKey={this.state.selectedOptionKey}
            students={data.students}
            toggleStudentFlag={this.toggleStudentFlag}
            updateSelectedOptionKey={this.updateSelectedOptionKey}
          />)
          break
        default:
          slide = <p>UNSUPPORTED QUESTION TYPE</p>
          break
      }
      return (
        <div>
          {this.renderPreviewModal()}
          {this.renderTimeoutModal()}
          {this.renderCongratulationsModal()}
          {this.renderSignupModal()}
          {slide}
        </div>
      )
    } else {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson : props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {

}

export interface StateFromProps {
  customize: any
  classroomLesson: any
  classroomSessions: any
}

export default connect<StateFromProps, DispatchFromProps, CurrentSlideProps>(select, dispatch => ({dispatch}))(CurrentSlide);
