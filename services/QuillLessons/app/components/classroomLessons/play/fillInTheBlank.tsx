declare function require(name:string);
import * as React from 'react'
import { firebase } from '../../../libs/firebase';
import _ from 'underscore'
import { QuestionData } from '../../../interfaces/classroomLessons'
import Cues from '../../../components/renderForQuestions/cues';
import TextEditor from '../../renderForQuestions/renderTextEditor';
import { WarningDialogue } from 'quill-component-library/dist/componentLibrary'
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  QuestionSubmissionsList,
  SelectedSubmissionsForQuestion
} from '../interfaces';
import promptSplitter from '../shared/promptSplitter'
import htmlStrip from '../shared/htmlStrip'
import { Feedback } from 'quill-component-library/dist/componentLibrary'
const icon = 'http://localhost:45537/images/icons/question_icon.svg' 

interface fillInTheBlankProps {
  data: QuestionData,
  handleStudentSubmission?: Function,
  mode?: string | null,
  submissions?: QuestionSubmissionsList | null,
  selected_submissions?: SelectedSubmissionsForQuestion | null,
  selected_submission_order?: Array<string> | null,
  projector?: boolean|null
}

interface fillInTheBlankState {
  editing: boolean,
  submitted: boolean,
  splitPrompt: Array<string>,
  inputVals: Array<string>,
  inputErrors: any // TODO: this should be Set
}

class FillInTheBlank extends React.Component<fillInTheBlankProps, fillInTheBlankState> {
  constructor(props) {
    super(props)
    const splitPrompt = promptSplitter(props.data.play.prompt);
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

  componentWillReceiveProps(nextProps, nextState) {
    const student = getParameterByName('student');
    if (student && nextProps.submissions && nextProps.submissions[student] && !this.state.submitted) {
      const submissionVals = nextProps.submissions[student].data.match(/<strong>(.*?)<\/strong>/g).map((term) => term.replace(/<strong>|<\/strong>/g, ''))
      this.setState({ submitted: true, inputVals: submissionVals })
    }
    // this will reset the state when a teacher resets a question
    const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
    if (this.state.submitted === true && (nextProps.submissions === null || retryForStudent)) {
      const splitPrompt = promptSplitter(nextProps.data.play.prompt)
      this.setState({ submitted: false, editing: false, inputVals: this.generateInputs(splitPrompt) });
    }

    // this will update the prompt when it changes
    const newSplitPrompt = promptSplitter(nextProps.data.play.prompt)
    if (!_.isEqual(newSplitPrompt,this.state.splitPrompt)) {
      this.setState({splitPrompt: newSplitPrompt, inputVals: this.generateInputs(newSplitPrompt)})
    }
  }

  generateInputs(promptArray): Array<string> {
    const inputs: Array<string> = [];
    for (let i = 0; i < promptArray.length - 2; i++) {
      inputs.push('');
    }
    return inputs;
  }

  getPromptElements(): Array<JSX.Element>|undefined {
    if (this.state.splitPrompt) {
      const { splitPrompt } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput: Array<JSX.Element|Array<JSX.Element>> = [];
      splitPrompt.forEach((section, i) => {
        if (i !== l - 1) {
          splitPromptWithInput.push(this.renderText(section));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(this.renderText(section));
        }
      });
      return _.flatten(splitPromptWithInput);
    }
  }

  updateBlankValue(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const existing = [...this.state.inputVals];
    existing[i] = e.target.value.trim();
    this.setState({
      editing: true,
      inputVals: existing,
    });
  }

  zipInputsAndText() {
    const boldInputs = this.state.inputVals.map((val) => `<strong>${val}</strong>&nbsp;`)
    const strippedPrompts = this.state.splitPrompt.map(p => htmlStrip(p))
    const zipped = _.zip(strippedPrompts, boldInputs);
    return _.flatten(zipped).join('');
  }

  renderInput(i: number) {
    let inputClass = this.state.submitted || this.props.mode === 'PROJECT' ? "disabled-button" : "";
    let warning
    if (this.state.inputErrors.has(i)) {
      warning = this.renderWarning();
      inputClass += 'bad-input'
    }
    const value = this.state.inputVals[i] ? this.state.inputVals[i] : ''
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
          value={value}
          onChange={(e) => this.updateBlankValue(e, i)}
          disabled={inputClass === "disabled-button"}
          onBlur={() => this.validateInput(i)}
        />
      </span>
    );
  }

  renderText(text: string) {
    const words = text.split(' ').filter(word => word !== '')
    const wordArray:Array<JSX.Element> = []
    words.forEach((word, i) => {
      let html = `${word}&nbsp;`
      wordArray.push(<div key={`${word}${i}`} dangerouslySetInnerHTML={{__html: html}}/>)
    })
    return wordArray
  }

  submitSubmission() {
    if (this.state.inputErrors.size === 0 && this.props.handleStudentSubmission) {
      this.props.handleStudentSubmission(this.zipInputsAndText());
      this.setState({ submitted: true, });
    }
  }

  renderInstructions() {
    if (this.props.mode !== 'PROJECT') {
      if (this.state.submitted) {
        return (<Feedback
          feedbackType="correct-matched"
          feedback={(<p>Great Work! Please wait as your teacher reviews your answer...</p>)}
        />);
      } else if (this.props.data.play.instructions) {
        return (<Feedback
          feedbackType="default"
          feedback={(<p dangerouslySetInnerHTML={{__html: this.props.data.play.instructions}}></p>)}
        />);
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

  inputsEmpty() {
    return this.state.inputVals.indexOf('') !== -1
  }

  renderSubmitButton() {
    if (this.props.mode !== 'PROJECT' && !this.props.projector) {
      if (this.state.editing && !this.inputsEmpty()) {
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

  renderPrompt(elements: Array<JSX.Element>|undefined) {
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
    const { selected_submissions, submissions, selected_submission_order, data} = this.props;
    const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
      let html
      if (submissions && submissions[key] && submissions[key].data) {
        html = submissions[key].data
      } else if (key === 'correct' && data.play && data.play.sampleCorrectAnswer){
        html = data.play.sampleCorrectAnswer
      } else {
        html = ''
      }
      return (
        <li key={index}>
          <span className="answer-number">{index + 1}</span><div style={{display: 'inline'}} dangerouslySetInnerHTML={{__html: html}} />
        </li>
      );
    }) : null;
    return (
      <ul className="class-answer-list">
        {selected}
      </ul>
    );
  }

  validateInput(i: number) {
    const newErrors = new Set(this.state.inputErrors);
    const inputVal = this.state.inputVals[i] || '';
    const cues = this.props.data.play.cues
    // the check that the first cue is not '' can disappear once the cms has been updated not to save an empty
    // array of cues as ''
    if (inputVal && cues.length > 0 && cues[0] !== '') {
      if (cues.indexOf(inputVal.toLowerCase()) === -1) {
        newErrors.add(i);
      } else {
        newErrors.delete(i);
      }
    }
    this.setState({ inputErrors: newErrors });
  }

  renderWarning() {
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
          <div style={{marginBottom: 20}}>
            {this.renderInstructions()}
          </div>
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
