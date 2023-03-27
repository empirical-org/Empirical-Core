declare function require(name:string);
import { stringNormalize } from 'quill-string-normalizer';
import * as React from 'react';
import * as _ from 'underscore';
import {
    Feedback,
    fillInBlankInputLabel
} from '../../../../Shared/index';

import { QuestionData } from '../../../interfaces/classroomLessons';
import { getParameterByName } from '../../../libs/getParameterByName';
import Cues from '../../renderForQuestions/cues';
import {
    QuestionSubmissionsList,
    SelectedSubmissionsForQuestion
} from '../interfaces';
import htmlStrip from '../shared/htmlStrip';
import promptSplitter from '../shared/promptSplitter';
import { PROJECT } from './constants';
import ProjectedAnswers from './projectedAnswers';
import ProjectorHeader from './projectorHeader';
import PromptSection from './promptSection';
import SubmitButton from './submitButton';

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
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    const { splitPrompt, submitted, } = this.state
    const student = getParameterByName('student');
    if (student && nextProps.submissions && nextProps.submissions[student] && !submitted) {
      const submissionVals = nextProps.submissions[student].data.match(/<strong>(.*?)<\/strong>/g).map((term) => term.replace(/<strong>|<\/strong>/g, ''))
      this.setState({ submitted: true, inputVals: submissionVals })
    }
    // this will reset the state when a teacher resets a question
    const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
    if (submitted === true && (nextProps.submissions === null || retryForStudent)) {
      const splitPrompt = promptSplitter(nextProps.data.play.prompt)
      this.setState({ submitted: false, editing: false, inputVals: this.generateInputs(splitPrompt) });
    }

    // this will update the prompt when it changes
    const newSplitPrompt = promptSplitter(nextProps.data.play.prompt)
    if (!_.isEqual(newSplitPrompt, splitPrompt)) {
      this.setState({splitPrompt: newSplitPrompt, inputVals: this.generateInputs(newSplitPrompt)})
    }
  }

  validateAllInputs = () => {
    const { data, } = this.props
    const { cues, } = data.play
    const { inputErrors, inputVals, } = this.state
    const newErrors = inputErrors;

    if (!(cues && cues.some(cue => cue.length))) {
      return Promise.resolve(true);
    }

    for (let i = 0; i < inputVals.length; i++) {
      const inputVal = inputVals[i] || '';
      const inputSufficient = inputVal;
      const cueMatch = (inputVal && cues.some(c => stringNormalize(c).toLowerCase() === stringNormalize(inputVal).toLowerCase().trim())) || (inputVal === '' && blankAllowed);

      if (inputSufficient && cueMatch) {
        delete newErrors[i]
      } else {
        newErrors[i] = true;
      }
    }
    // following condition will return false if no new errors
    if (_.size(newErrors)) {
      const newInputVals = inputVals
      this.setState({ inputErrors: newErrors, inputVals: newInputVals })
    } else {
      this.setState({ inputErrors: newErrors });
    }
    return Promise.resolve(true);
  }

  generateInputs(promptArray): Array<string> {
    const inputs: Array<string> = [];
    for (let i = 0; i < promptArray.length - 2; i+=1) {
      inputs.push('');
    }
    return inputs;
  }

  getPromptElements(): Array<JSX.Element>|undefined {
    const { splitPrompt } = this.state;

    if (!splitPrompt) { return }

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

  updateBlankValue = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { inputVals, } = this.state
    const existing = [...inputVals];
    existing[i] = e.target.value
    this.setState({
      editing: existing.find(val => val.length),
      inputVals: existing,
    });
  }

  zipInputsAndText() {
    const { inputVals, splitPrompt, } = this.state
    const boldInputs = inputVals.map((val) => `<strong>${val}</strong>`)
    const strippedPrompts = splitPrompt.map(p => htmlStrip(p))
    const zipped = _.zip(strippedPrompts, boldInputs);
    return _.flatten(zipped).join('');
  }

  renderInput = (i: number) => {
    const { mode, data, projector, } = this.props
    const { submitted, inputVals, inputErrors, editing, } = this.state
    const { cues, } = data.play

    const disabled = submitted || mode === PROJECT || projector
    let inputClass = disabled ? "disabled" : "";
    inputClass += editing && !submitted ? ' editing' : ''
    inputClass += inputErrors[i] ? ' error' : ''
    const value = inputVals[i] ? inputVals[i] : ''
    const longestCue = cues && cues.length ? cues.sort((a: { length: number }, b: { length: number }) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 20) + 10 : 50
    const styling = { width: `${width}px` }
    const updateBlankValue = (e) => this.updateBlankValue(e, i)
    return (
      <input
        aria-label={fillInBlankInputLabel(cues)}
        autoComplete="off"
        className={inputClass}
        disabled={disabled}
        id={`input${i}`}
        key={i + 100}
        onChange={updateBlankValue}
        style={styling}
        type="text"
        value={value}
      />
    );
  }

  renderText(text: string) {
    const words = text.split(' ').filter(word => word !== '')
    const wordArray:Array<JSX.Element> = []
    words.forEach((word, i) => {
      let html = `${word}&nbsp;`
      wordArray.push(<div dangerouslySetInnerHTML={{__html: html}} key={`${word}${i}`} />)
    })
    return wordArray
  }

  handleSubmit = () => {
    this.validateAllInputs().then(() => {
      const { inputErrors, } = this.state;
      const { handleStudentSubmission, } = this.props
      const noErrors = _.size(inputErrors) === 0;
      if (noErrors && handleStudentSubmission) {
        handleStudentSubmission(this.zipInputsAndText());
        this.setState({ submitted: true, });
      }
    })
  }

  renderInstructions() {
    const { mode, data, } = this.props
    const { inputErrors, } = this.state
    const errorsPresent = _.size(inputErrors) !== 0;

    if (mode === PROJECT || (!errorsPresent && !data.play.instructions)) { return }

    const feedback = errorsPresent ? 'Choose one of the options provided. Make sure it is spelled correctly.' : data.play.instructions
    const feedbackType = errorsPresent ? 'revise-unmatched' : 'default'

    return (
      <Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: feedback}} />)}
        feedbackType={feedbackType}
      />
    );
  }

  renderCues() {
    const { mode, data, } = this.props
    if (mode === PROJECT || !data.play.cues) { return }
    return (
      <Cues cues={data.play.cues} displayArrowAndText={true} />
    );
  }

  renderSubmitButton() {
    const { mode, } = this.props
    const { submitted, inputVals, } = this.state
    if (submitted || mode === PROJECT) { return }

    const disabled = !inputVals.find(val => val.length)
    return <SubmitButton disabled={disabled} onClick={this.handleSubmit} />
  }

  renderPrompt(elements: Array<JSX.Element>|undefined) {
    const { mode, } = this.props
    const prompt = <div className="prompt">{elements}</div>
    return (
      <PromptSection
        mode={mode}
        promptElement={prompt}
      />
    )
  }

  renderProject() {
    const { selected_submissions, selected_submission_order, data, projector, submissions, mode, } = this.props

    if (mode !== PROJECT) { return }
    const { sampleCorrectAnswer, } = data.play

    return (
      <ProjectedAnswers
        projector={projector}
        response={this.zipInputsAndText()}
        sampleCorrectAnswer={sampleCorrectAnswer}
        selectedSubmissionOrder={selected_submission_order}
        selectedSubmissions={selected_submissions}
        submissions={submissions}
      />
    )
  }


  validateInput(i: number) {
    const { data, } = this.props
    const { inputErrors, inputVals, } = this.state
    const newErrors = new Set(inputErrors);
    const inputVal = inputVals[i] || '';
    const { cues, } = data.play
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

  renderProjectorHeader() {
    const { projector, studentCount, submissions, mode, } = this.props

    if (!projector || mode === PROJECT) { return }

    return <ProjectorHeader studentCount={studentCount} submissions={submissions} />
  }

  renderWarning() {
    return (
      <div className="warning-dialogue">
        <span>Use one of the options below.</span>
        <i className="fa fa-caret-down" />
      </div>
    );
  }

  renderSubmittedBar() {
    const { mode, } = this.props
    const { submitted, } = this.state

    if (!submitted || mode === PROJECT) { return }

    return <div className="submitted-bar">Please wait as your teacher reviews your response.</div>
  }

  render() {
    return(
      <div className="fill-in-the-blank student-slide-wrapper">
        <div className="all-but-submitted-bar">
          {this.renderProjectorHeader()}
          {this.renderPrompt(this.getPromptElements())}
          {this.renderCues()}
          {this.renderInstructions()}
          {this.renderProject()}
          {this.renderSubmitButton()}
        </div>
        {this.renderSubmittedBar()}
      </div>

    )
  }
}

export default FillInTheBlank
