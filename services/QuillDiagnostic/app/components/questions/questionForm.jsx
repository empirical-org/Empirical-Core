import React from 'react'
import {
  TextEditor,
  hashToCollection,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import _ from 'lodash'
import ConceptSelector from '../shared/conceptSelector.jsx'

export default class extends React.Component {
  state = {
    prompt: "",
    concept: this.props.question.conceptID,
    instructions: this.props.question.instructions ? this.props.question.instructions : "",
    flag: this.props.question.flag ? this.props.question.flag : "alpha",
    cuesLabel: this.props.question.cuesLabel ? this.props.question.cuesLabel : '',
    prefilledText: this.props.question.prefilledText ? this.props.question.prefilledText : ''
  };

  submit = () => {
    const questionObj = {
      conceptUID: this.props.question.conceptUID,
      cuesLabel: this.props.question.cuesLabel,
      focusPoints: this.props.question.focusPoints,
      incorrectSequences: this.props.question.incorrectSequences,
      modelConceptUID: this.props.question.modelConceptUID,
      prefilledText: this.state.prefilledText,
      prompt: this.state.prompt,
      cues: this.refs.cues.value.split(','),
      instructions: this.state.instructions,
      flag: this.state.flag,
      cuesLabel: this.state.cuesLabel
    }
    if (this.props.new) {
      const optimalResponseObj = {text: this.state.prefilledText.trim(), optimal: true, count: 0, feedback: "That's a strong sentence!"}
      this.props.submit(questionObj, optimalResponseObj)
    } else {
      questionObj.conceptID = this.state.concept
      this.props.submit(questionObj)
    }
  };

  handlePrefilledText = (e) => {
    this.setState({ prefilledText: e.target.value });
  };

  handlePromptChange = (e) => {
    this.setState({prompt: e})
  };

  handleInstructionsChange = (e) => {
    this.setState({instructions: e.target.value})
  };

  renderConceptSelector = () => {
    if (!this.props.new) {
      return (<div>
        <label className="label">Concept</label>
        <div>
          <ConceptSelector
            currentConceptUID={this.state.concept}
            handleSelectorChange={this.handleSelectorChange}
          />
        </div>
      </div>)
    }
  };

  renderOptimalResponse = () => {
    if (this.props.new) {
      return (<div>
        <label className="label">Optimal Response</label>
        <p className="control">
          <input className="input" onChange={this.handlePrefilledText} type="text" />
        </p>
      </div>)
    }
  };

  handleSelectorChange = (e) => {
    this.setState({concept: e.value})
  };

  handleConceptChange = () => {
    this.setState({concept: this.refs.concept.value})
  };

  handleFlagChange = (e) => {
    this.setState({ flag: e.target.value, });
  };

  handleCuesLabelChange = (e) => {
    this.setState({ cuesLabel: e.target.value, });
  };

  renderPreFillSection = () => {
    const { question } = this.props
    return (
      <div>
        <label className="label" htmlFor="prefilledText" >Prefilled Text (place 5 underscores where you want the user to fill in _____)</label>
        <p className="control">
          <input className="input" defaultValue={question.prefilledText} id="prefilledText" onChange={this.handlePrefilledText} type="text" />
        </p>
      </div>
    );
  }

  render() {
    const preFillSection = this.props.new ? <span /> : this.renderPreFillSection()
    if(this.props.new || this.props.concepts.hasreceiveddata) {
      return (
        <div className="box">
          <h6 className="control subtitle">Create a new question</h6>
          <label className="label">Prompt</label>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handlePromptChange}
            text={this.props.question.prompt || ""}
          />
          <label className="label">Instructions for student</label>
          <p className="control">
            <textarea className="input" defaultValue={this.props.question.instructions} onChange={this.handleInstructionsChange} ref="instructions" type="text" />
          </p>
          <label className="label">Cues Label (default is "joining words"/"joining word" for single cues, enter a space to have no label)</label>
          <p className="control">
            <input className="input" defaultValue={this.props.question.cuesLabel} onChange={this.handleCuesLabelChange} type="text" />
          </p>
          <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
          <p className="control">
            <input className="input" defaultValue={this.props.question.cues} ref="cues" type="text" />
          </p>
          {this.renderOptimalResponse()}
          {preFillSection}

          <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false} />
          {this.renderConceptSelector()}
          <br />
          <button className="button is-primary" onClick={this.submit}>Update Question</button>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}
