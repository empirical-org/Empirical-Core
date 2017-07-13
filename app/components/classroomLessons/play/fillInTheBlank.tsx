import * as React from 'react'
import { QuestionData } from '../../../interfaces/classroomLessons'
import Cues from 'components/renderForQuestions/cues';
import icon from 'img/question_icon.svg';
import TextEditor from '../../renderForQuestions/renderTextEditor';
import {
  Submissions,
  SelectedSubmissions
} from '../interfaces';
const moment = require('moment');

class FillInTheBlank extends React.Component<{data: QuestionData, handleStudentSubmission: Function, mode: string, submissions: Submissions, selected_submissions: SelectedSubmissions }> {
  constructor(props) {
    super(props)
    const splitPrompt = props.data.play.prompt.split('___');
    this.state = {
      editing: false,
      submitted: false,
      splitPrompt,
      inputVals: this.generateInputs(splitPrompt)
    };
    this.submitSubmission = this.submitSubmission.bind(this);
    this.updateBlankValue = this.updateBlankValue.bind(this)
  }

  generateInputs(promptArray) {
    const inputs = [];
    for (let i = 0; i < promptArray.length - 2; i++) {
      inputs.push('');
    }
    return inputs;
  }

  getPromptElements() {
    if (this.state.splitPrompt) {
      const { splitPrompt, } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput = [];
      splitPrompt.forEach((section, i) => {
        if (i !== l - 1) {
          splitPromptWithInput.push(this.renderText(section, i));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(this.renderText(section, i));
        }
      });
      return splitPromptWithInput;
    }
  }

  updateBlankValue(e, i) {
    const existing = [...this.state.inputVals];
    existing[i] = e.target.value.trim();
    this.setState({
      editing: true,
      inputVals: existing,
    });
  }

  zipInputsAndText() {
    const boldInputs = this.state.inputVals.map((val) => `<strong>${val}</strong>`)
    const zipped = _.zip(this.state.splitPrompt, boldInputs);
    return _.flatten(zipped).join('');
  }

  renderInput(i) {
    return (
      <span key={`span${i}`}>
        <input
          id={`input${i}`}
          key={i + 100}
          type="text"
          value={this.state.inputVals[i]}
          onChange={(e) => this.updateBlankValue(e, i)}
        />
      </span>
    );
  }

  renderText(text, i) {
    return <span key={i}>{text}</span>;
  }

  submitSubmission() {
    this.props.handleStudentSubmission(this.zipInputsAndText(), moment().format());
    this.setState({ submitted: true, });
  }

  renderInstructions() {
    if (this.props.mode !== 'PROJECT') {
      if (this.state.submitted) {
        return (<div className="feedback-row">
          <p><i className="fa fa-check-circle" aria-hidden="true" />Great Work! Please wait as your teacher reviews your answer...</p>
        </div>);
      } else if (this.props.data.play.instructions) {
        return (<div className="feedback-row">
          <img src={icon} />
          <p>{this.props.data.play.instructions}</p>
        </div>);
      }
    }
  }

  renderCues() {
    if (this.props.mode !== 'PROJECT') {
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
  }

  renderSubmitButton() {
    if (this.props.mode !== 'PROJECT') {
      if (this.state.editing) {
        return (<div className="question-button-group">
          <button disabled={this.state.submitted} onClick={this.submitSubmission} className="button student-submit">Submit</button>
        </div>);
      } else {
        return (<div className="question-button-group">
          <button disabled={true} className="button student-submit">Submit</button>
        </div>);
      }

    }
  }

  renderPrompt(elements) {
    return <div className="prompt">{elements}</div>
  }

  render() {
    return(
      <div className="fill-in-the-blank">
        {this.renderPrompt(this.getPromptElements())}
        {this.renderCues()}
        {this.renderInstructions()}
        {this.renderSubmitButton()}
      </div>

    )
  }
}

export default FillInTheBlank
