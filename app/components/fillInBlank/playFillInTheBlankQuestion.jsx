import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import RenderSentenceFragments from '../renderForQuestions/sentenceFragments.jsx';
import icon from '../../img/question_icon.svg';

const styles = {
  container: {
    marginTop: 15,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 24,
  },
  input: {
    color: '#3D3D3D',
    fontSize: 24,
    marginLeft: 5,
    marginRight: 5,
    width: 75,
    textAlign: 'center',
  },
  text: {

  },
};

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

  getPromptElements() {
    const splitPrompt = this.props.question.prompt.split('___');
    const l = splitPrompt.length;
    const splitPromptWithInput = [];
    splitPrompt.forEach((section, i) => {
      if (i != l - 1) {
        splitPromptWithInput.push(section);
        splitPromptWithInput.push((
          <input style={styles.input} type="text" />
        ));
      } else {
        splitPromptWithInput.push(section);
      }
    });
    return splitPromptWithInput;
  }

  renderPrompt() {
    return (
      <div style={styles.container} >
        {this.getPromptElements()}
      </div>
    );
  }

  checkAnswer() {
    return false;
  }

  render() {
    const instructions = (this.props.question.instructions && this.props.question.instructions !== '') ? this.props.question.instructions : 'Combine the sentences into one sentence. Combinar las frases en una frase.';
    const button = <button className="button student-submit" onClick={this.checkAnswer}>Submit</button>;
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
            <div className="question-button-group button-group">
              {button}
            </div>
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
