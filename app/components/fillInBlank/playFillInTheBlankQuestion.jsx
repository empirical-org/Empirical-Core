import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import icon from '../../img/question_icon.svg';
import Grader from '../../libs/fillInBlank.js';
import { hashToCollection } from '../../libs/hashToCollection';
import { submitResponse, } from '../../actions/diagnostics.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';

const styles = {
  container: {
    marginTop: 15,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 24,
  },
  input: {
    color: '#3D3D3D',
    fontSize: 24,
    marginRight: 10,
    width: 75,
    textAlign: 'center',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderImageSource: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1) 5%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0))',
    borderImageSlice: 1,
  },
  text: {
    marginRight: 10,
  },
};

class PlayFillInTheBlankQuestion extends Component {
  constructor() {
    super();
    this.checkAnswer = this.checkAnswer.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.state = {
      splitPrompt: [],
      inputVals: [],
      inputErrors: new Set(),
    };
  }

  // $('input').getBoundingClientRect();

  componentDidMount() {
    this.setState({
      splitPrompt: this.getQuestion().prompt.split('___'),
      inputVals: this.generateInputs(this.getQuestion().prompt.split('___')),
      cues: this.getQuestion().cues,
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
    existing[i] = e.target.value.trim();
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler(index) {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  renderText(text, i) {
    let style = {};
    if (text.length > 0) {
      style = styles.text;
    }
    return <span key={i} style={style}>{text}</span>;
  }

  validateInput(i) {
    const newErrors = new Set(this.state.inputErrors);
    const inputVal = this.state.inputVals[i];
    if (inputVal && this.state.cues.indexOf(this.state.inputVals[i]) === -1) {
      newErrors.add(i);
    } else {
      newErrors.delete(i);
    }
    this.setState({ inputErrors: newErrors, }, () => console.log(this.state.inputErrors));
  }

  renderInput(i) {
    return (
      <input
        key={i + 100}
        style={styles.input}
        type="text"
        onChange={this.getChangeHandler(i)}
        value={this.state.inputVals[i]}
        onBlur={() => this.validateInput(i)}
      />
    );
  }

  getPromptElements() {
    if (this.state.splitPrompt) {
      const { splitPrompt, } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput = [];
      splitPrompt.forEach((section, i) => {
        if (i != l - 1) {
          splitPromptWithInput.push(this.renderText(section, i));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(this.renderText(section, i));
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

  nextQuestion() {
    this.props.nextQuestion();
  }

  checkAnswer() {
    this.setState({ checkingAnswer: true, });
    const zippedAnswer = this.zipInputsAndText();
    const fields = {
      prompt: this.getQuestion().prompt,
      responses: hashToCollection(this.state.responses),
      questionUID: this.getQuestion().key,
    };
    const newQuestion = new Grader(fields);
    const response = newQuestion.checkMatch(zippedAnswer);
    this.updateResponseResource(response);
    this.submitResponse(response);
    this.setState({
      editing: false,
      response: '',
    },
      this.nextQuestion()
    );
  }

  submitResponse(response) {
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  }

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  }

  render() {
    const instructions = (this.props.question.instructions && this.props.question.instructions !== '') ? this.props.question.instructions : 'Combine the sentences into one sentence. Combinar las frases en una frase.';
    const button = <button className="button student-submit" onClick={this.checkAnswer}>Submit</button>;
    return (
      <div className="student-container-inner-diagnostic">
        <div style={{ display: 'flex', }}>
          <div>
            {this.renderPrompt()}
            <Cues getQuestion={this.getQuestion} customText={'Add words or leave blank'} />
            <div className="feedback-row">
              <img src={icon} style={{ marginTop: 3, }} />
              <p dangerouslySetInnerHTML={{ __html: instructions, }} />
            </div>
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
  };
}

export default connect(select)(PlayFillInTheBlankQuestion);
