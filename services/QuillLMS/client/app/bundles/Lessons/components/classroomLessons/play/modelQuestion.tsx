declare function require(name:string);
import * as React from 'react';
import {
  Feedback,
  SentenceFragments
} from '../../../../Shared/index';
import {
  QuestionData
} from '../../../interfaces/classroomLessons';
import Cues from '../../renderForQuestions/cues';
import { textEditorInputNotEmpty } from '../shared/textEditorClean';
const teacherPointingSrc = `${process.env.CDN_URL}/images/icons/teacher-pointing.svg`

interface ModelQuestionProps {
  data: QuestionData,
  model?: string|null,
  prompt?: string|null,
  projector?: boolean
}

interface ModelQuestionState {}

class ModelQuestion extends React.Component<ModelQuestionProps, ModelQuestionState> {
  renderInstructions() {
    const { data, } = this.props

    if (!data.play.instructions) { return }

    return (
      <Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: data.play.instructions}} />)}
        feedbackType="default"
      />
    );
  }

  renderCues() {
    const { data, } = this.props
    if (!data.play.cues) { return }
    return (
      <Cues
        cues={data.play.cues}
        displayArrowAndText={false}
      />
    );
  }

  renderTeacherModel() {
    const { model, } = this.props
    return (
      <div className="display-mode">
        <p className="answer-header">
          Teacher&#39;s response
        </p>
        <p className="teacher-model" dangerouslySetInnerHTML={{__html: model}} />
      </div>
    )
  }

  renderQuestionOrHTML() {
    const { data, prompt, } = this.props
    if (!data.play.prompt) { return }
    const editedPrompt = prompt;
    const promptNotEmpty = textEditorInputNotEmpty(editedPrompt);
    const promptToShow = promptNotEmpty ? editedPrompt : data.play.prompt;
    return (
      <div>
        <SentenceFragments prompt={promptToShow} />
        {this.renderCues()}
        {this.renderInstructions()}
      </div>
    )
  }

  renderProjectorHeader() {
    const { projector, } = this.props
    if (!projector) { return }
    return (
      <div className="projector-header-section">
        <div className="students-watch-tag tag"><img alt="Teacher pointing to a chalkboard icon" src={teacherPointingSrc} /><span>Students watch</span></div>
      </div>
    )
  }

  renderSubmittedBar() {
    const { projector, } = this.props

    if (projector) { return }

    return <div className="submitted-bar"><strong>Watch your teacher.</strong> No need to type a response this time.</div>
  }


  render() {
    return (
      <div className="student-model-wrapper student-slide-wrapper">
        <div className="all-but-submitted-bar">
          {this.renderProjectorHeader()}
          {this.renderQuestionOrHTML()}
          {this.renderTeacherModel()}
        </div>
        {this.renderSubmittedBar()}
      </div>
    );
  }
}

export default ModelQuestion;
