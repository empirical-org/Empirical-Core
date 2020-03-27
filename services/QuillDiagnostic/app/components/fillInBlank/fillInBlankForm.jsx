import React, { Component } from 'react';
import { EditorState, ContentState } from 'draft-js'
import { connect } from 'react-redux';
import { TextEditor,
  hashToCollection,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import ConceptSelector from '../shared/conceptSelector.jsx';

class FillInBlankForm extends Component {
  constructor() {
    super();
    this.state = {
      prompt: '',
      blankAllowed: false,
      caseInsensitive: false,
      instructions: '',
      cues: '',
      newQuestionOptimalResponse: '',
      itemLevel: 'Select Item Level',
      flag: 'alpha',
      cuesLabel: ''
    };
  }

  UNSAFE_componentWillMount() {
    const { state } = this.props;
    if(state) {
      this.setState(state);
    }
  }

  handlePromptChange = prompt => {
    console.log('prompt', prompt);
    this.setState({ prompt });
  };

  handleInstructionsChange = e => {
    this.setState({instructions: e.target.value});
  };

  handleCuesChange = e => {
    this.setState({cues: e.target.value});
  };

  handleNewQuestionOptimalResponseChange = e => {
    this.setState({newQuestionOptimalResponse: e.target.value});
  };

  handleItemLevelChange = e => {
    this.setState({itemLevel: e.target.value});
  };

  handleSelectorChange = e => {
    this.setState({conceptID: e.value});
  };

  handleFlagChange = e => {
    this.setState({ flag: e.target.value, });
  };

  handleCuesLabelChange = e => {
    this.setState({ cuesLabel: e.target.value, });
  };

  itemLevelToOptions() {
    const { itemLevels } = this.props;
    const { data } = itemLevels;
    return hashToCollection(data).map((level) => {
      const { key, name } = level;
      return (
        <option key={key}>{name}</option>
      )
    });
  }

  toggleQuestionBlankAllowed = () => {
    const { blankAllowed } = this.state;
    this.setState({blankAllowed: !blankAllowed});
  };

  toggleQuestionCaseInsensitive = () => {
    this.setState(prevState => ({caseInsensitive: !prevState.caseInsensitive}));
  };

  submit = () => {
    const { action } = this.props;
    const { blankAllowed, caseInsensitive, conceptID, cues, cuesLabel, flag, instructions, itemLevel, newQuestionOptimalResponse, prompt } = this.state;
    const data = {
      prompt,
      blankAllowed: blankAllowed ? blankAllowed : false,
      caseInsensitive: caseInsensitive ? caseInsensitive : false,
      cues: cues.split(','),
      itemLevel: itemLevel === "Select Item Level" ? "" : itemLevel,
      instructions,
      conceptID,
      flag: flag ? flag : 'alpha',
      cuesLabel
    };
    action(data, newQuestionOptimalResponse);
  };

  clearForm() {
    this.setState({
      blankAllowed: false,
      caseInsensitive: false,
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
    const { editing } = this.props;
    const { newQuestionOptimalResponse } = this.state;
    if(!editing) {
      return(
        <div>
          <label className="label">Optimal Response</label>
          <p className="control">
            <input className="input" onChange={this.handleNewQuestionOptimalResponseChange} type="text" value={newQuestionOptimalResponse} />
          </p>
        </div>
      );
    }
  }

  renderButtonText() {
    const { editing } = this.props;
    return editing ? 'Submit Edit' : 'Add Question';
  }

  render() {
    const { blankAllowed, caseInsensitive, conceptID, cues, cuesLabel, flag, instructions, itemLevel, prompt } = this.state;
    return(
      <form className="box" onSubmit={this.submit}>
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handlePromptChange}
          text={prompt}
        />
        <br />
        <label className="label">Instructions for student</label>
        <p className="control">
          <textarea className="input" onChange={this.handleInstructionsChange} type="text" value={instructions} />
        </p>
        <label className="label">Cues Label (default is "joining words"/"joining word" for single cues, enter a space to have no label)</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesLabelChange} type="text" value={cuesLabel} />
        </p>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesChange} type="text" value={cues} />
        </p>
        {this.renderOptimalField()}
        <label className="label" onClick={this.toggleQuestionBlankAllowed}>Blank Allowed?</label>
        <p className="control">
          <input checked={blankAllowed} onClick={this.toggleQuestionBlankAllowed} type="checkbox" />
        </p>
        <label className="label" onClick={this.toggleQuestionBlankAllowed}>Case Insensitive?</label>
        <p className="control">
          <input checked={caseInsensitive} onClick={this.toggleQuestionCaseInsensitive} type="checkbox" />
        </p>

        <label className="label">Item level</label>
        <p className="control">
          <span className="select">
            <select onChange={this.handleItemLevelChange} value={itemLevel}>
              <option value="Select Item Level">Select Item Level</option>
              {this.itemLevelToOptions()}
            </select>
          </span>
        </p>
        <FlagDropdown flag={flag} handleFlagChange={this.handleFlagChange} isLessons={false} />
        <label className="label">Concept</label>
        <ConceptSelector currentConceptUID={conceptID} handleSelectorChange={this.handleSelectorChange} />
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
