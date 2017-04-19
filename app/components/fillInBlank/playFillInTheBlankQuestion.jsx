import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import RenderSentenceFragments from '../renderForQuestions/sentenceFragments.jsx';
import icon from '../../img/question_icon.svg';

class ClassName extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    getGradedResponsesWithCallback(
      this.getQuestion().key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  getQuestion() {
    const { question, } = this.props;
    return question;
  }

  render() {
    const instructions = (this.props.question.instructions && this.props.question.instructions !== '') ? this.props.question.instructions : 'Combine the sentences into one sentence. Combinar las frases en una frase.';
    return (
      <div className="student-container-inner-diagnostic">
        <div style={{ display: 'flex', }}>
          <div>
            <RenderSentenceFragments prompt={'Fill In The Blanks'} />

            <div className="feedback-row">
              <img src={icon} style={{ marginTop: 3, }} />
              <p dangerouslySetInnerHTML={{ __html: instructions, }} />
            </div>

            {this.renderPrompt()}
          </div>
        </div>
      </div>
    );
  }

}

function select(props) {
  return {
    Key: props.Value,
  };
}

export default connect(select)(ClassName);
