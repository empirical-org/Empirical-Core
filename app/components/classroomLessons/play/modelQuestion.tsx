import React, { Component } from 'react';
import Cues from 'components/renderForQuestions/cues';
import RenderSentenceFragments from 'components/renderForQuestions/sentenceFragments';
import icon from 'img/question_icon.svg';


class ModelQuestion extends Component<any, any> {
  renderInstructions() {
    if (this.props.data.play.instructions) {
      return (<div className="feedback-row">
        <img src={icon} />
        <p>{this.props.data.play.instructions}</p>
      </div>);
    }
  }

  renderCues() {
    if (this.props.data.play.cues) {
      return (
        <Cues
          getQuestion={() => ({
            cues: this.props.data.play.cues,
          })
        }
          displayArrowAndText={false}
        />
      );
    }
    return (
      <span />
    );
  }

  renderTeacherModel() {
    if (this.props.model) {
      return (
        <div className="teacher-model-container">
          <p className="answer-header">
            Teacher Answer:
          </p>
          <p className="teacher-model">
            {this.props.model}
          </p>
        </div>
      )
    } else {
      return (
        <span />
      )
    }

  }

  render() {
    return (
      <div>
        <RenderSentenceFragments prompt={this.props.data.play.prompt} />
        {this.renderCues()}
        {this.renderInstructions()}
        {this.renderTeacherModel()}
      </div>
    );
  }
}

export default ModelQuestion;
