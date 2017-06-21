import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  goToNextSlide,
  updateCurrentSlide,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode
} from '../../../actions/classroomSessions.js';
import CLLobby from './lobby.jsx';
import CLStatic from './static.jsx';
import CLSingleAnswer from './singleAnswer.jsx';

class TeachClassroomLessonContainer extends Component {
  constructor(props) {
    super(props);
    this.renderCurrentSlide = this.renderCurrentSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(startListeningToSession(this.props.location.query.classroom_activity_id));
  }

  renderCurrentSlide(data) {
    const current = data.questions[data.current_slide];
    console.log(current.type);
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLLobby data={data} goToNextSlide={this.goToNextSlide} />
        );
      case 'CL-ST':
        return (
          <CLStatic data={data} goToNextSlide={this.goToNextSlide} />
        );
      case 'CL-SA':
        return (
          <CLSingleAnswer data={data} goToNextSlide={this.goToNextSlide} toggleSelected={this.toggleSelected} startDisplayingAnswers={this.startDisplayingAnswers} stopDisplayingAnswers={this.stopDisplayingAnswers} />
        );
      default:

    }
  }

  goToNextSlide() {
    this.props.dispatch(goToNextSlide(this.props.location.query.classroom_activity_id));
  }

  toggleSelected(current_slide, student) {
    console.log('toggling');
    const submissions = this.props.classroomSessions.data.selected_submissions;
    const currentSlide = submissions ? submissions[current_slide] : undefined;
    const currentValue = currentSlide ? currentSlide[student] : undefined;
    console.log(currentValue);
    if (!currentValue) {
      saveSelectedStudentSubmission(this.props.location.query.classroom_activity_id, current_slide, student);
    } else {
      removeSelectedStudentSubmission(this.props.location.query.classroom_activity_id, current_slide, student);
    }
  }

  startDisplayingAnswers() {
    console.log('Starting');
    setMode(this.props.location.query.classroom_activity_id, this.props.classroomSessions.data.current_slide, 'PROJECT');
  }

  stopDisplayingAnswers() {
    removeMode(this.props.location.query.classroom_activity_id, this.props.classroomSessions.data.current_slide);
  }

  render() {
    const { data, hasreceiveddata, } = this.props.classroomSessions;
    if (hasreceiveddata) {
      const component = this.renderCurrentSlide(data);
      return (
        component
      );
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
