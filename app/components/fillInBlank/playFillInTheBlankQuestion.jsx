import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
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
    this.checkAnswer = this.checkAnswer.bind(this);
    this.state = {
      splitPrompt: [],
      inputVals: [],
    };
  }

  componentDidMount() {
    this.setState({
      splitPrompt: this.getQuestion().prompt.split('___'),
      inputVals: this.generateInputs(this.getQuestion().prompt.split('___')),
    });
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

  generateInputs(promptArray) {
    const inputs = [];
    for (let i = 0; i < promptArray.length - 2; i++) {
      inputs.push('');
    }
    return inputs;
  }

  handleChange(i, e) {
    const existing = [...this.state.inputVals];
    existing[i] = e.target.value;
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler(index) {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  getPromptElements() {
    if (this.state.splitPrompt) {
      const { splitPrompt, } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput = [];
      splitPrompt.forEach((section, i) => {
        if (i != l - 1) {
          splitPromptWithInput.push(section);
          splitPromptWithInput.push((
            <input
              style={styles.input}
              type="text"
              onChange={this.getChangeHandler(i)}
              value={this.state.inputVals[i]}
            />
          ));
        } else {
          splitPromptWithInput.push(section);
        }
      });
      return splitPromptWithInput;
    }
  }

  renderPrompt() {
    return (
      <div style={styles.container} >
        {this.getPromptElements()}
      </div>
    );
  }

  zipInputsAndText() {
    const zipped = _.zip(this.state.splitPrompt, this.state.inputVals);
    return _.flatten(zipped).join('');
  }

  checkAnswer() {
    const zippedAnswer = this.zipInputsAndText();
    console.log(zippedAnswer);
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
