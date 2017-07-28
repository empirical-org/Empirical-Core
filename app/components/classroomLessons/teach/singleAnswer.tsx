import React, { Component } from 'react';
import ScriptComponent from '../shared/scriptComponent';
import {
  ClassroomLessonSession,
} from '../interfaces'
import {
  ClassroomLesson
} from 'interfaces/classroomLessons'
import { textEditorInputNotEmpty } from '../shared/textEditorClean'

interface SingleAnswerProps {
  data: ClassroomLessonSession,
  lessonData: ClassroomLesson,
  toggleStudentFlag: Function,
  toggleSelected: Function,
  startDisplayingAnswers: Function,
  stopDisplayingAnswers: Function,
  toggleOnlyShowHeaders: React.EventHandler<React.MouseEvent<HTMLParagraphElement>>,
  updateToggledHeaderCount: Function,
  clearAllSubmissions: Function,
  clearAllSelectedSubmissions: Function,
  onlyShowHeaders: boolean,
  saveModel: Function,
  savePrompt: Function,
}

interface SingleAnswerState {

}

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
    const { selected_submissions, submissions, current_slide, students, presence, modes, timestamps, flaggedStudents, models, selected_submission_order, prompts} = this.props.data;
    const promptNotEmpty = prompts && textEditorInputNotEmpty(prompts[current_slide]);
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
          prompt={promptNotEmpty ? prompts[current_slide] : this.props.lessonData.questions[current_slide].data.play.prompt}
          lessonPrompt={this.props.lessonData.questions[current_slide].data.play.prompt}
          selected_submission_order={selected_submission_order}
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
          updateToggledHeaderCount={this.props.updateToggledHeaderCount}
          clearAllSelectedSubmissions={this.props.clearAllSelectedSubmissions}
          clearAllSubmissions={this.props.clearAllSubmissions}
          toggleStudentFlag={this.props.toggleStudentFlag}
          saveModel={this.props.saveModel}
          slideType={this.props.lessonData.questions[this.props.data.current_slide].type}
          savePrompt={this.props.savePrompt}
        />

      </div>
    );
  }

}

export default SingleAnswer;
