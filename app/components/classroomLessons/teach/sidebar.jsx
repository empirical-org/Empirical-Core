import React, { Component } from 'react';
import { connect } from 'react-redux';
import CurrentSlide from './currentSlide.jsx';
import { getParameterByName } from 'libs/getParameterByName';
import {
  goToNextSlide,
  updateCurrentSlide,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  toggleOnlyShowHeaders,
  clearAllSelectedSubmissions,
  clearAllSubmissions,
  updateSlideInFirebase
} from '../../../actions/classroomSessions';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static.jsx';
import CLStudentSingleAnswer from '../play/singleAnswer.jsx';
import {
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
} from '../interfaces';

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.toggleOnlyShowHeaders = this.toggleOnlyShowHeaders.bind(this);
    this.clearAllSelectedSubmissions = this.clearAllSelectedSubmissions.bind(this);
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this);
  }
  componentDidUpdate(prevProps) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    console.log(prevProps.classroomSessions.data.currentSlide, this.props.classroomSessions.data.currentSlide, prevProps.classroomSessions.data.currentSlide !== this.props.classroomSessions.data.currentSlide);
    if (prevProps.classroomSessions.data.currentSlide !== this.props.classroomSessions.data.currentSlide) {
      updateSlideInFirebase(caId, this.props.classroomSessions.data.currentSlide);
    }
  }

  goToNextSlide() {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      const updateInStore = goToNextSlide(caId, this.props.classroomSessions.data);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  goToSlide(slide_id: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      this.props.dispatch(updateCurrentSlide(caId, slide_id));
    }
  }

  toggleSelected(currentSlide: string, student: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[currentSlide] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      if (!currentValue) {
        saveSelectedStudentSubmission(caId, currentSlide, student);
      } else {
        removeSelectedStudentSubmission(caId, currentSlide, student);
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
      setMode(caId, this.props.classroomSessions.data.currentSlide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      removeMode(caId, this.props.classroomSessions.data.currentSlide);
    }
  }

  render() {
    const { data, hasreceiveddata, } = this.props.classroomSessions;
    if (hasreceiveddata && data) {
      const questions = data.questions;
      const length = questions.length;
      const currentSlide = data.current_slide;
      const components: JSX.Element[] = [];
      let counter = 0;
      for (const slide in questions) {
        counter += 1;
        const activeClass = currentSlide === slide ? 'active' : '';
        console.log(currentSlide, slide);
        let thumb;
        switch (questions[slide].type) {
          case 'CL-LB':
            thumb = (
              <CLStudentLobby data={data} />
            );
            break;
          case 'CL-ST':
            thumb = (
              <CLStudentStatic data={questions[slide].data} />
            );
            break;
          case 'CL-SA':
            const mode: string | null = data.modes && data.modes[data.currentSlide] ? data.modes[data.currentSlide] : null;
            const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.currentSlide] ? data.submissions[data.currentSlide] : null;
            const selected_submissions = data.selected_submissions && data.selected_submissions[data.currentSlide] ? data.selected_submissions[data.currentSlide] : null;
            const props = { mode, submissions, selected_submissions, };
            thumb = (
              <CLStudentSingleAnswer data={questions[slide].data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
            );
            break;
          default:
            thumb = questions[slide].type;
        }
        components.push((
          <div key={counter} onClick={() => this.goToSlide(slide)}>
            <p className={`slide-number ${activeClass}`}>Slide {counter} / {length}</p>
            <div className={`slide-preview ${activeClass}`}>
              <div className="scaler">
                {thumb}
              </div>
            </div>
          </div>
        ));
      }
      return (
        <div className="side-bar">
          {components}
        </div>
      );
    }
    return (
      <div className="side-bar">
          Loading...
        </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
  };
}

export default connect(select)(Sidebar);
