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
  removeSelectedSubmissionOrder,
} from '../../../actions/classroomSessions';
import Spinner from 'components/shared/spinner'
import CLLobby from './lobby';
import CLStatic from './static';
import CLSingleAnswer from './singleAnswer';
import CLExit from './exit';
import PreviewModal from './previewModal'
import TimeoutModal from './timeoutModal'
import CongratulationsModal from './congratulationsModal'
import { getParameterByName } from 'libs/getParameterByName';
import {
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  ClassroomLessonSession
} from '../interfaces';
import {
  ClassroomLesson,
  ScriptItem
} from 'interfaces/classroomLessons';
import {generate} from '../../../libs/conceptResults/classroomLessons.js';

class CurrentSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const data: ClassroomLessonSession = props.classroomSessions.data;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
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
    this.clearSelectedSubmissionOrder = this.clearSelectedSubmissionOrder.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this)
    this.closeTimeoutModal = this.closeTimeoutModal.bind(this)
    this.closeCongratulationsModal = this.closeCongratulationsModal.bind(this)
    this.openStudentView = this.openStudentView.bind(this)
    this.finishLesson = this.finishLesson.bind(this)
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
  }

  componentDidMount() {
    // setTimeout(() => this.setState({showTimeoutModal: true}), 43200000)
        setTimeout(() => this.setState({showTimeoutModal: true}), 5000)
  }

  componentWillReceiveProps(nextProps) {
    const element = document.getElementsByClassName("main-content")[0];
    if (element && (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)) {
      element.scrollTop = 0;
    }
    if (nextProps.classroomSessions.hasreceiveddata && nextProps.classroomLesson.hasreceiveddata) {
      const data: ClassroomLessonSession = nextProps.classroomSessions.data;
      const lessonData: ClassroomLesson = nextProps.classroomLesson.data;
      const script: Array<ScriptItem> = lessonData && lessonData.questions ? lessonData.questions[data.current_slide].data.teach.script : []
      this.setState({
        numberOfHeaders: script.filter(scriptItem => scriptItem.type === 'STEP-HTML' || scriptItem.type === 'STEP-HTML-TIP').length,
      })
    }
  }

  toggleSelected(currentSlideId: string, student: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlideId] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      updateStudentSubmissionOrder(caId, currentSlideId, student)
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

  clearStudentSubmission(currentSlideId: string, student: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      removeStudentSubmission(caId, currentSlideId, student);
    }
  }

  clearSelectedSubmissionOrder(currentSlideId: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      removeSelectedSubmissionOrder(caId, currentSlideId);
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

  toggleStudentFlag(student_id: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    toggleStudentFlag(ca_id, student_id);
  }

  saveModel(model: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      setModel(caId, this.props.classroomSessions.data.current_slide, model);
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
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      setPrompt(caId, this.props.classroomSessions.data.current_slide, prompt);
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

  openStudentView() {
    const studentUrl: string = window.location.href.replace('teach', 'play')
    window.open(studentUrl, 'newwindow', `width=${window.innerWidth},height=${window.innerHeight}`)
    this.closePreviewModal()
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  finishLesson() {
    const questions = this.props.classroomLesson.data.questions
    const submissions = this.props.classroomSessions.data.submissions

    const caId: string|null = getParameterByName('classroom_activity_id');
    const concept_results = generate(questions, submissions)
    const data = new FormData();
    data.append( "json", JSON.stringify( {follow_up: false, concept_results} ) );
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${caId}/finish_lesson`, {
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
      redirectAssignedStudents(caId, this.state.selectedOptionKey, response.follow_up_url)
      this.setState({completed: true, showTimeoutModal: false, showCongratulationsModal: true})
    }).catch((error) => {
      console.log('error', error)
    })
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

  render() {
    const data: ClassroomLessonSession = this.props.classroomSessions.data;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const lessonId: string = this.props.classroomLesson.id
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    if (this.props.classroomSessions.hasreceiveddata && lessonDataLoaded) {
      const current = lessonData.questions[parseInt(data.current_slide) || 0];
      let slide
      switch (current.type) {
        case 'CL-LB':
          slide = <CLLobby data={data} lessonData={lessonData} slideData={current} />
          break
        case 'CL-ST':
          slide = <CLStatic
              data={data}
              lessonData={lessonData}
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
              lessonData={lessonData}
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
              clearSelectedSubmissionOrder={this.clearSelectedSubmissionOrder}
            />
          break
        case 'CL-EX':
          slide = <CLExit
              data={data}
              selectedOptionKey={this.state.selectedOptionKey}
              updateSelectedOptionKey={this.updateSelectedOptionKey}
              lessonData={lessonData}
              script={current.data.teach.script}
              flaggedStudents={data.flaggedStudents}
              students={data.students}
              toggleStudentFlag={this.toggleStudentFlag}
              lessonId={lessonId}
              assignAction={this.finishLesson}
              completed={this.state.completed}
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
  };
}

export default connect(select)(CurrentSlide);
