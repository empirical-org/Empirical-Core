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
  hideSignupModal
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
  ClassroomLessonSession
} from '../interfaces';
import {
  ClassroomLesson,
  ScriptItem
} from '../../../interfaces/classroomLessons';
import * as CustomizeIntf from '../../../interfaces/customize'
import {generate} from '../../../libs/conceptResults/classroomLessons.js';


class CurrentSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const data: ClassroomLessonSession = props.classroomSessions.data;
    const lessonData: ClassroomLesson = props.classroomLesson.data;
    const script: Array<ScriptItem> = lessonData && lessonData.questions && lessonData.questions[data.current_slide] ? lessonData.questions[data.current_slide].data.teach.script : []

    this.state = {
      numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      numberOfToggledHeaders: 0,
      showPreviewModal: getParameterByName('modal'),
      showTimeoutModal: false,
      showCongratulationsModal: false,
      completed: false,
      selectedOptionKey: data.followUpActivityName ? "Small Group Instruction and Independent Practice" : '',
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

  toggleSelected(currentSlideId: string, student: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlideId] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      updateStudentSubmissionOrder(classroomUnitId, currentSlideId, student)
      if (!currentValue) {
        saveSelectedStudentSubmission(classroomUnitId, currentSlideId, student);
      } else {
        removeSelectedStudentSubmission(classroomUnitId, currentSlideId, student);
      }
    }
  }

  clearAllSelectedSubmissions(currentSlide: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');

    if (classroomUnitId) {
      clearAllSelectedSubmissions(classroomUnitId, currentSlide);
    }
  }

  clearAllSubmissions(currentSlide: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      clearAllSubmissions(classroomUnitId, currentSlide);
    }
  }

  clearStudentSubmission(currentSlideId: string, student: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      removeStudentSubmission(classroomUnitId, currentSlideId, student);
    }
  }

  toggleOnlyShowHeaders() {
    this.props.dispatch(toggleOnlyShowHeaders());
  }

  startDisplayingAnswers() {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      setMode(classroomUnitId, this.props.classroomSessions.data.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      removeMode(classroomUnitId, this.props.classroomSessions.data.current_slide);
    }
  }

  toggleStudentFlag(studentId: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    toggleStudentFlag(classroomUnitId, studentId);
  }

  saveModel(model: string) {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      setModel(classroomUnitId, this.props.classroomSessions.data.current_slide, model);
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
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      setPrompt(classroomUnitId, this.props.classroomSessions.data.current_slide, prompt);
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
    const activityId = this.props.lessonId;
    const classroomUnitId: string = getParameterByName('classroom_unit_id');
    const conceptResults = generate(questions, submissions);
    const editionId: string|undefined = this.props.classroomSessions.data.edition_id;
    const data = new FormData();

    data.append("json", JSON.stringify({
      follow_up: followUp,
      concept_results: conceptResults,
      edition_id: editionId,
      activity_id: activityId,
      classroom_unit_id: classroomUnitId,
    }));

    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/finish_lesson`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      if (classroomUnitId) {
        redirectAssignedStudents(
          classroomUnitId,
          this.state.selectedOptionKey,
          response.follow_up_url
        );
      }
      this.setState({
        completed: true,
        showTimeoutModal: false,
        showCongratulationsModal: true
       });
    }).catch((error) => {
      console.log('error', error);
    })
  }

  timeOut() {
    if (!this.props.classroomSessions.data.preview) {
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
      return <CongratulationsModal closeModal={this.closeCongratulationsModal} lessonId={this.props.lessonId}/>
    }
  }

  renderSignupModal() {
    if (this.props.classroomSessions.showSignupModal) {
      return <SignupModal
        closeModal={this.closeSignupModal}
        lessonId={this.props.lessonId}
        goToSignup={() => window.location.href = `${process.env.EMPIRICAL_BASE_URL}/account/new`}
      />
    }
  }

  render() {
    const data: ClassroomLessonSession = this.props.classroomSessions.data;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const editionData: CustomizeIntf.EditionQuestions = this.props.customize.editionQuestions;
    const lessonId: string = this.props.classroomLesson.id
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
          slide = <CLStatic
              data={data}
              editionData={editionData}
              toggleOnlyShowHeaders={this.toggleOnlyShowHeaders}
              onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
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
              onlyShowHeaders={this.props.classroomSessions.onlyShowHeaders}
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
    classroomSessions: props.classroomSessions,
    classroomLesson : props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(CurrentSlide);
