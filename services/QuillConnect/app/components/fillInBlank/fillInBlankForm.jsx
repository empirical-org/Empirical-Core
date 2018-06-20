import React, { Component } from 'react';
import { connect } from 'react-redux';
import {hashToCollection} from '../../libs/hashToCollection';
import TextEditor from '../questions/textEditor.jsx';
import ConceptSelector from '../shared/conceptSelector.jsx';
import FlagDropdown from '../shared/flagDropdown.jsx';


class FillInBlankForm extends Component {
  constructor() {
    super();
    this.state = {
      prompt: '',
      blankAllowed: false,
      instructions: '',
      cues: '',
      newQuestionOptimalResponse: '',
      itemLevel: 'Select Item Level',
      flag: 'alpha',
      cuesLabel: ''
    };
    this.toggleQuestionBlankAllowed = this.toggleQuestionBlankAllowed.bind(this);
    this.handlePromptChange = this.handlePromptChange.bind(this);
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this);
    this.handleCuesChange = this.handleCuesChange.bind(this);
    this.handleNewQuestionOptimalResponseChange = this.handleNewQuestionOptimalResponseChange.bind(this);
    this.handleItemLevelChange = this.handleItemLevelChange.bind(this);
    this.handleSelectorChange = this.handleSelectorChange.bind(this);
    this.handleFlagChange = this.handleFlagChange.bind(this);
    this.handleCuesLabelChange = this.handleCuesLabelChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handlePromptChange(prompt) {
    this.setState({ prompt });
  }

  handleInstructionsChange(e) {
    this.setState({instructions: e.target.value});
  }

  handleCuesChange(e) {
    this.setState({cues: e.target.value});
  }

  handleNewQuestionOptimalResponseChange(e) {
    this.setState({newQuestionOptimalResponse: e.target.value});
  }

  handleItemLevelChange(e) {
    this.setState({itemLevel: e.target.value});
  }

  handleSelectorChange(e) {
    this.setState({conceptID: e.value});
  }

  handleFlagChange(e) {
    this.setState({ flag: e.target.value, });
  }

  handleCuesLabelChange(e) {
    this.setState({ cuesLabel: e.target.value, });
  }

  itemLevelToOptions() {
    return hashToCollection(this.props.itemLevels.data).map((level) => {
      return (
        <option key={level.key}>{level.name}</option>
      )
    });
  }

  toggleQuestionBlankAllowed() {
    this.setState({blankAllowed: !this.state.blankAllowed});
  }

  submit() {
    const data = {
      prompt: this.state.prompt,
      blankAllowed: this.state.blankAllowed ? this.state.blankAllowed : false,
      cues: this.state.cues.split(','),
      itemLevel: this.state.itemLevel === "Select Item Level" ? "" : this.state.itemLevel,
      instructions: this.state.instructions,
      conceptID: this.state.conceptID,
      flag: this.state.flag ? this.state.flag : 'alpha',
      cuesLabel: this.state.cuesLabel
    };
    this.props.action(data, this.state.newQuestionOptimalResponse);
  }

  clearForm() {
    this.setState({
      blankAllowed: false,
      newQuestionPrompt: '',
      newQuestionOptimalResponse: '',
      instructions: '',
      itemLevel: 'Select Item Level',
      conceptID: null,
      flag: 'alpha',
      cuesLabel: ''
    });
  }

  componentWillMount() {
    if(this.props.state) {
      this.setState(this.props.state);
    }
  }

  renderOptimalField() {
    if(!this.props.editing) {
      return(
        <div>
          <label className="label">Optimal Response</label>
          <p className="control">
            <input className="input" type="text" value={this.state.newQuestionOptimalResponse} onChange={this.handleNewQuestionOptimalResponseChange}></input>
          </p>
        </div>
      );
    }
  }

  renderButtonText() {
    return this.props.editing ? 'Submit Edit' : 'Add Question';
  }

  render() {
    return(
      <form className="box" onSubmit={this.submit}>
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor text={this.state.prompt} handleTextChange={this.handlePromptChange} />
        <br />
        <label className="label">Instructions for student</label>
        <p className="control">
          <textarea className="input" type="text" value={this.state.instructions} onChange={this.handleInstructionsChange}></textarea>
        </p>
        <label className="label">Cues Label (default is "joining words" for multiple cues and "joining word" for single cues)</label>
        <p className="control">
          <input className="input" type="text" value={this.state.cuesLabel} onChange={this.handleCuesLabelChange}></input>
        </p>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" type="text" value={this.state.cues} onChange={this.handleCuesChange}></input>
        </p>
        {this.renderOptimalField()}
        <label className="label" onClick={this.toggleQuestionBlankAllowed}>Blank Allowed?</label>
        <p className="control">
          <input type="checkbox" checked={this.state.blankAllowed} onClick={this.toggleQuestionBlankAllowed}></input>
        </p>

        <label className="label">Item level</label>
        <p className="control">
          <span className="select">
            <select value={this.state.itemLevel} onChange={this.handleItemLevelChange}>
              <option value="Select Item Level">Select Item Level</option>
              {this.itemLevelToOptions()}
            </select>
          </span>
        </p>
        <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false}/>
        <label className="label">Concept</label>
        <ConceptSelector currentConceptUID={this.state.conceptID} handleSelectorChange={this.handleSelectorChange} />
        <br />
        <button type="submit" className="button is-primary">{this.renderButtonText()}</button>
      </form>
    );
  }
}

function select(state) {
  return {
    itemLevels: state.itemLevels
  };
}

export default connect(select)(FillInBlankForm);
