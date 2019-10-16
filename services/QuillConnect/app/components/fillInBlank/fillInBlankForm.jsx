import * as React from 'react';
import { connect } from 'react-redux';
import { hashToCollection, TextEditor, FlagDropdown } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import ConceptSelector from '../shared/conceptSelector.jsx';


class FillInBlankForm extends React.Component {
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

  componentWillMount() {
    if(this.props.state) {
      this.setState(this.props.state);
    }
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

  renderOptimalField() {
    if(!this.props.editing) {
      return(
        <div>
          <label className="label">Optimal Response</label>
          <p className="control">
            <input className="input" onChange={this.handleNewQuestionOptimalResponseChange} type="text" value={this.state.newQuestionOptimalResponse} />
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
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handlePromptChange}
          text={this.state.prompt}
        />
        <br />
        <label className="label">Instructions for student</label>
        <p className="control">
          <textarea className="input" onChange={this.handleInstructionsChange} type="text" value={this.state.instructions} />
        </p>
        <label className="label">Cues Label (default is "joining words"/"joining word" for single cues, enter a space to have no label)</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesLabelChange} type="text" value={this.state.cuesLabel} />
        </p>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesChange} type="text" value={this.state.cues} />
        </p>
        {this.renderOptimalField()}
        <label className="label" onClick={this.toggleQuestionBlankAllowed}>Blank Allowed?</label>
        <p className="control">
          <input checked={this.state.blankAllowed} onClick={this.toggleQuestionBlankAllowed} type="checkbox" />
        </p>

        <label className="label">Item level</label>
        <p className="control">
          <span className="select">
            <select onChange={this.handleItemLevelChange} value={this.state.itemLevel}>
              <option value="Select Item Level">Select Item Level</option>
              {this.itemLevelToOptions()}
            </select>
          </span>
        </p>
        <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false} />
        <label className="label">Concept</label>
        <ConceptSelector currentConceptUID={this.state.conceptID} handleSelectorChange={this.handleSelectorChange} />
        <br />
        <button className="button is-primary" type="submit">{this.renderButtonText()}</button>
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
