import * as React from 'react';
import ScriptComponent from '../shared/scriptComponent';
import {
  ClassroomLessonSession,
} from '../interfaces'
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'
import { textEditorInputNotEmpty } from '../shared/textEditorClean'
import * as CustomizeIntf from '../../../interfaces/customize'

interface SingleAnswerProps {
  data: ClassroomLessonSession,
  editionData: CustomizeIntf.EditionQuestions,
  toggleStudentFlag: Function,
  toggleSelected: Function,
  startDisplayingAnswers: Function,
  stopDisplayingAnswers: Function,
  toggleOnlyShowHeaders: React.EventHandler<React.MouseEvent<HTMLParagraphElement>>,
  updateToggledHeaderCount: Function,
  clearAllSubmissions: Function,
  clearAllSelectedSubmissions: Function,
  onlyShowHeaders?: boolean,
  saveModel: Function,
  clearStudentSubmission: Function,
  savePrompt: Function,
}

interface SingleAnswerState {

}

class SingleAnswer extends React.Component<SingleAnswerProps, SingleAnswerState> {
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
    const { data, editionData, } = this.props
    const { selected_submissions, submissions, current_slide, students, presence, modes, timestamps, flaggedStudents, models, selected_submission_order, prompts} = data;
    const currentSlideType = editionData.questions[current_slide].type
    const promptNotEmpty = prompts && prompts[current_slide] && textEditorInputNotEmpty(prompts[current_slide]);
    const showHeaderText: string = this.props.onlyShowHeaders ? 'Show Step-By-Step Guide' : 'Hide Step-By-Step Guide';
    return (
      <div className="teacher-single-answer">
        <div className="header">
          <h1>
            <span>Slide {this.props.data.current_slide}:</span> {this.props.editionData.questions[this.props.data.current_slide].data.teach.title}
          </h1>
          <button className="interactive-wrapper focus-on-light" onClick={this.props.toggleOnlyShowHeaders} type="button">
            {showHeaderText}
          </button>
        </div>
        <ScriptComponent
          clearAllSelectedSubmissions={this.props.clearAllSelectedSubmissions}
          clearAllSubmissions={this.props.clearAllSubmissions}
          clearStudentSubmission={this.props.clearStudentSubmission}
          cues={editionData.questions[current_slide].data.play.cues || undefined}
          current_slide={current_slide}
          currentSlideType={currentSlideType}
          flaggedStudents={flaggedStudents}
          lessonPrompt={this.props.editionData.questions[current_slide].data.play.prompt}
          models={models}
          modes={modes}
          onlyShowHeaders={this.props.onlyShowHeaders}
          presence={presence}
          prompt={promptNotEmpty ? prompts[current_slide] : ''}
          sampleCorrectAnswer={this.props.editionData.questions[this.props.data.current_slide].data.play.sampleCorrectAnswer}
          saveModel={this.props.saveModel}
          savePrompt={this.props.savePrompt}
          script={this.props.editionData.questions[this.props.data.current_slide].data.teach.script}
          selected_submission_order={selected_submission_order}
          selected_submissions={selected_submissions}
          slideType={this.props.editionData.questions[this.props.data.current_slide].type}
          startDisplayingAnswers={this.startDisplayingAnswers}
          stopDisplayingAnswers={this.stopDisplayingAnswers}
          students={students}
          submissions={submissions}
          timestamps={timestamps}
          toggleSelected={this.toggleSelected}
          toggleStudentFlag={this.props.toggleStudentFlag}
          updateToggledHeaderCount={this.props.updateToggledHeaderCount}
        />

      </div>
    );
  }

}

export default SingleAnswer;
