import React, { Component } from 'react';
import ScriptComponent from '../shared/scriptComponent';
import {
  ClassroomLessonSession,
} from '../interfaces'
import {
  ClassroomLesson
} from 'interfaces/classroomLessons'

interface SingleAnswerProps {
  data: ClassroomLessonSession,
  lessonData: ClassroomLesson,
  toggleStudentFlag: Function,
  toggleSelected: Function,
  startDisplayingAnswers: Function,
  stopDisplayingAnswers: Function,
  toggleOnlyShowHeaders: React.EventHandler<React.MouseEvent<HTMLParagraphElement>>,
  clearAllSubmissions: Function,
  clearAllSelectedSubmissions: Function,
  onlyShowHeaders: boolean,
  saveModel: Function,
}

interface SingleAnswerState {}

class SingleAnswer extends Component<SingleAnswerProps, SingleAnswerState> {
  constructor(props) {
    super(props);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
  }

  toggleSelected(event, current_slide: string, student: string) {
    this.props.toggleSelected(current_slide, student);
  }

  startDisplayingAnswers() {
    this.props.startDisplayingAnswers();
  }

  stopDisplayingAnswers() {
    this.props.stopDisplayingAnswers();
  }

  render() {
    const { selected_submissions, submissions, current_slide, students, presence, modes, timestamps, flaggedStudents, models} = this.props.data;
    const showHeaderText: string = this.props.onlyShowHeaders ? 'Show Step-By-Step Guide' : 'Hide Step-By-Step Guide';
    return (
      <div className="teacher-single-answer">
        <div className="header">
          <h1>
            <span>Slide {parseInt(this.props.data.current_slide) + 1}:</span> {this.props.lessonData.questions[this.props.data.current_slide].data.teach.title}
          </h1>
          <p onClick={this.props.toggleOnlyShowHeaders}>
            {showHeaderText}
          </p>
        </div>
        <ScriptComponent
          script={this.props.lessonData.questions[this.props.data.current_slide].data.teach.script}
          prompt={this.props.lessonData.questions[this.props.data.current_slide].data.play.prompt}
          selected_submissions={selected_submissions}
          submissions={submissions}
          current_slide={current_slide}
          students={students}
          presence={presence}
          modes={modes}
          models={models}
          flaggedStudents={flaggedStudents}
          startDisplayingAnswers={this.startDisplayingAnswers}
          stopDisplayingAnswers={this.stopDisplayingAnswers}
          toggleSelected={this.toggleSelected}
          timestamps={timestamps}
          onlyShowHeaders={this.props.onlyShowHeaders}
          clearAllSelectedSubmissions={this.props.clearAllSelectedSubmissions}
          clearAllSubmissions={this.props.clearAllSubmissions}
          toggleStudentFlag={this.props.toggleStudentFlag}
          saveModel={this.props.saveModel}
          savePrompt={this.props.savePrompt}
        />

      </div>
    );
  }

}

export default SingleAnswer;
