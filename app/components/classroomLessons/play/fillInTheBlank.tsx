declare function require(name:string);
import * as React from 'react'
import _ from 'underscore'
import { QuestionData } from '../../../interfaces/classroomLessons'
import Cues from 'components/renderForQuestions/cues';
import icon from 'img/question_icon.svg';
import TextEditor from '../../renderForQuestions/renderTextEditor';
import WarningDialogue from 'components/fillInBlank/warningDialogue'
import {
  QuestionSubmissionsList,
  SelectedSubmissionsForQuestion
} from '../interfaces';
import {
  scriptTagStrip
} from '../shared/scriptTagStrip';
const moment = require('moment');

class FillInTheBlank extends React.Component<{data: QuestionData; handleStudentSubmission: Function; mode: string; submissions: QuestionSubmissionsList; selected_submissions: SelectedSubmissionsForQuestion}> {
  constructor(props) {
    super(props)
    const splitPrompt = props.data.play.prompt.split('___');
    this.state = {
      editing: false,
      submitted: false,
      splitPrompt: splitPrompt,
      inputVals: this.generateInputs(splitPrompt),
      inputErrors: new Set()
    };
    this.submitSubmission = this.submitSubmission.bind(this);
    this.updateBlankValue = this.updateBlankValue.bind(this);
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
      const { splitPrompt } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput: Array<JSX.Element> = [];
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
    let inputClass = this.state.submitted || this.props.mode === 'PROJECT' ? "disabled-button" : "";
    let warning
    if (this.state.inputErrors.has(i)) {
      warning = this.renderWarning(i);
      inputClass += 'bad-input'
    }
    return (
      <span key={`span${i}`}>
        <div className='warning'>
          {warning}
        </div>
        <input
          className={inputClass}
          id={`input${i}`}
          key={i + 100}
          type="text"
          value={this.state.inputVals[i]}
          onChange={(e) => this.updateBlankValue(e, i)}
          disabled={this.state.submitted}
          onBlur={() => this.validateInput(i)}
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

  renderProject() {
    const classAnswers = this.props.selected_submissions
    ? (<div>
      <p className="answer-header"><i className="fa fa-users" />Class Answers:</p>
      {this.renderClassAnswersList()}
    </div>)
    : <span />;
    return (
      <div className="display-mode">
        {this.renderPrompt(this.getPromptElements())}
        {classAnswers}
      </div>
    );
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, } = this.props;
    const selected = Object.keys(selected_submissions).map((key, index) => {
      const text: any = submissions[key].data;
      return (<li key={index}>
        <span className="answer-number">{index + 1}</span><span dangerouslySetInnerHTML={{ __html: text }} />
      </li>);
    });
    return (
      <ul className="class-answer-list" >
        {selected}
      </ul>
    );
  }

  validateInput(i) {
    const newErrors = new Set(this.state.inputErrors);
    const inputVal = this.state.inputVals[i] || '';

    if (inputVal && this.props.data.play.cues.indexOf(inputVal.toLowerCase()) === -1) {
      newErrors.add(i);
    } else {
      newErrors.delete(i);
    }

    // following condition will return false if no new errors
    if (newErrors.size) {
      const newInputVals = this.state.inputVals
      newInputVals[i] = ''
      this.setState({ inputErrors: newErrors, inputVals: newInputVals })
    } else {
      this.setState({ inputErrors: newErrors });
    }
  }

  renderWarning(i) {
    return (
      <div className="warning-dialogue">
        <span>Use one of the words below.</span>
        <i className="fa fa-caret-down"/>
    </div>
    );
  }

  render() {
    let content
    if (this.props.mode === 'PROJECT') {
      content = this.renderProject()
    } else {
      content = (
        <div>
          {this.renderPrompt(this.getPromptElements())}
          {this.renderCues()}
          {this.renderInstructions()}
          {this.renderSubmitButton()}
        </div>
        )
    }
    return(
      <div className="fill-in-the-blank">
      {content}
      </div>

    )
  }
}

export default FillInTheBlank
