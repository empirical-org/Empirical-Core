declare function require(name:string): any
import React, { Component } from 'react';
import Cues from '../../../components/renderForQuestions/cues';
import {
  QuestionData
} from '../../../interfaces/classroomLessons';
import { textEditorInputNotEmpty } from '../shared/textEditorClean'
import {
  Feedback,
  SentenceFragments
} from 'quill-component-library/dist/componentLibrary'
const icon = 'https://assets.quill.org/images/icons/question_icon.svg'

interface ModelQuestionProps {
  data: QuestionData,
  model?: string|null,
  prompt?: string|null,
  projector?: boolean
}

interface ModelQuestionState {}

class ModelQuestion extends Component<ModelQuestionProps, ModelQuestionState> {
  constructor(props) {
    super(props)
  }

  renderInstructions() {
    if (this.props.data.play.instructions) {
      return (<Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: this.props.data.play.instructions}} />)}
        feedbackType="default"
      />);
    }
  }

  renderCues() {
    if (this.props.data.play.cues) {
      return (
        <Cues
          displayArrowAndText={false}
          getQuestion={() => ({
            cues: this.props.data.play.cues,
          })}
        />
      );
    }
    return (
      <span />
    );
  }

  renderTeacherModel() {
    const model = this.props.model;
    const modelNotEmpty = textEditorInputNotEmpty(model);
    if (modelNotEmpty && this.props.model) {
      return (
        <div className="teacher-model-container">
          <p className="answer-header">
            Teacher Answer:
          </p>
          <p className="teacher-model" dangerouslySetInnerHTML={{__html: this.props.model}} />
        </div>
      )
    } else {
      return (
        <span />
      )
    }

  }

  renderQuestionOrHTML() {
    if (this.props.data.play.prompt) {
      const editedPrompt = this.props.prompt;
      const promptNotEmpty = textEditorInputNotEmpty(editedPrompt);
      const prompt = promptNotEmpty ? editedPrompt : this.props.data.play.prompt;
      return (
        <div>
          <SentenceFragments prompt={prompt} />
          {this.renderCues()}
          {this.renderInstructions()}
        </div>
      )
    } else {
      return (
        <div className="student-model-question">
          <p dangerouslySetInnerHTML={{__html: this.props.data.play.html}} />
        </div>
      )
    }
  }

  renderProjectorHeader() {
    if (this.props.projector) {
      return (<div className="projector-header-section">
        <div className="students-watch-teacher tag">Students Watch Teacher</div>
      </div>)
    }
  }


  render() {
    return (
      <div className="student-model-wrapper">
        {this.renderProjectorHeader()}
        {this.renderQuestionOrHTML()}
        {this.renderTeacherModel()}
      </div>
    );
  }
}

export default ModelQuestion;
