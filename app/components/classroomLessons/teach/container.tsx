import * as React from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  goToNextSlide,
  updateCurrentSlide,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  getClassroomAndTeacherNameFromServer,
  loadStudentNames,
} from '../../../actions/classroomSessions';
import CLLobby from './lobby';
import CLStatic from './static.jsx';
import CLSingleAnswer from './singleAnswer.jsx';
import { getParameterByName } from 'libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
} from '../interfaces';

declare var process : {
  env: {
    EMPIRICAL_BASE_URL: string,
    NODE_ENV: string
  }
}

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.renderCurrentSlide = this.renderCurrentSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
  }

  componentDidMount() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      this.props.dispatch(startListeningToSession(ca_id));
      this.props.dispatch(getClassroomAndTeacherNameFromServer(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      this.props.dispatch(loadStudentNames(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // below is for spoofing if you log in with Amber M. account
      // this.props.dispatch(getClassroomAndTeacherNameFromServer('341912', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames('341912', process.env.EMPIRICAL_BASE_URL))
    }
  }


  renderCurrentSlide(data) {
    const current = data.questions[data.current_slide];
    console.log(current.type);
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLLobby data={data} slideData={current} />
        );
      case 'CL-ST':
        return (
          <CLStatic data={data}/>
        );
      case 'CL-SA':
        return (
          <CLSingleAnswer data={data} toggleSelected={this.toggleSelected} startDisplayingAnswers={this.startDisplayingAnswers} stopDisplayingAnswers={this.stopDisplayingAnswers} />
        );
      default:

    }
  }

  goToNextSlide() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      goToNextSlide(ca_id, this.props.classroomSessions.data);
    }
  }

  goToSlide(slide_id: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      updateCurrentSlide(ca_id, slide_id);
    }
  }

  toggleSelected(current_slide: string, student: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[current_slide] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      if (!currentValue) {
        saveSelectedStudentSubmission(ca_id, current_slide, student);
      } else {
        removeSelectedStudentSubmission(ca_id, current_slide, student);
      }
    }

  }

  startDisplayingAnswers() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      setMode(ca_id, this.props.classroomSessions.data.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      removeMode(ca_id, this.props.classroomSessions.data.current_slide);
    }
  }

  renderSidebar(data: ClassroomLessonSession) {
    const questions = data.questions;
    const length = questions.length;
    const current_slide = data.current_slide;
    let components: JSX.Element[] = []
    let counter = 0;
    for (let slide in questions) {
      counter += 1;
      const activeClass = current_slide === slide ? "active" : ""
      components.push((
        <div key={`slide#${counter}`} onClick={() => this.goToSlide(slide)}>
          <p className={"slide-number " + activeClass}>Slide {counter} / {length}</p>
          <div className={"slide-preview " + activeClass}>
            {questions[slide].type}
          </div>
        </div>
      ))
    }
    return components
  }

  renderNextSlideButton() {
    return (
      <div className="next-slide-button-container">
        <button onClick={this.goToNextSlide}>Next Slide</button>
      </div>
    );
  }

  render() {
    const { data, hasreceiveddata, } = this.props.classroomSessions;
    if (hasreceiveddata && data) {
      const component = this.renderCurrentSlide(data);
      if (component) {
        return (
          <div className="teach-lesson-container">
            <div className="side-bar">
              {this.renderSidebar(data)}
            </div>
            <div className="main-content">
              <div className="main-content-wrapper">
                {component}
                {this.renderNextSlideButton()}
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
    // classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(TeachClassroomLessonContainer);
