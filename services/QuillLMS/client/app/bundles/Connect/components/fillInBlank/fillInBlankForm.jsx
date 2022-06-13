import React, { Component } from 'react';
import { EditorState, ContentState } from 'draft-js'
import ConceptSelector from '../shared/conceptSelector.jsx';
import C from '../../constants.js'
import { TextEditor, FlagDropdown } from '../../../Shared/index';

class FillInBlankForm extends Component {
  constructor(props) {
    super(props);
    const { blankAllowed, caseInsensitive, conceptID, cues, cuesLabel, flag, instructions, prompt} = props
    this.state = {
      blankAllowed: blankAllowed || false,
      caseInsensitive: caseInsensitive || false,
      conceptID: conceptID || '',
      cues: cues || '',
      cuesLabel: cuesLabel || '',
      flag: flag || 'alpha',
      instructions: instructions || '',
      newQuestionOptimalResponse: '',
      prompt: prompt || '',
      showDefaultInstructions: false,
    };
  }

  clearForm = () => {
    this.setState({
      blankAllowed: false,
      caseInsensitive: false,
      newQuestionPrompt: '',
      newQuestionOptimalResponse: '',
      instructions: '',
      conceptID: null,
      flag: 'alpha',
      cuesLabel: '',
      showDefaultInstructions: false,
    });
  }

  handleCuesChange = e => {
    this.setState({cues: e.target.value});
  };

  handleCuesLabelChange = e => {
    this.setState({ cuesLabel: e.target.value, });
  };

  handleFlagChange = e => {
    this.setState({ flag: e.target.value, });
  };

  handleInstructionsChange = e => {
    this.setState({instructions: e.target.value});
    if (e.target.value == '/') {
      this.setState({ showDefaultInstructions: true})
    } else {
      this.setState({ showDefaultInstructions: false})
    }
  };

  handleNewQuestionOptimalResponseChange = e => {
    this.setState({newQuestionOptimalResponse: e.target.value});
  };

  handlePromptChange = prompt => {
    this.setState({ prompt });
  };

  handleSelectorChange = e => {
    this.setState({conceptID: e.value});
  };

  renderDefaultInstructions = () => {
    const { showDefaultInstructions } = this.state
    const defaultInstructionsDiv = C.DEFAULT_FILL_IN_BLANKS_INSTRUCTIONS.map((item, i) =>
      (<button
        className="default"
        key={i}
        onClick={this.handleInstructionsChange}
        type="button"
        value={item}
      >
        {item}
      </button>)
    )
    if (showDefaultInstructions) {
      return (
        <div style={{position: 'relative'}}>
          <div className='default-instructions'>
            {defaultInstructionsDiv}
          </div>
        </div>
      )
    }
  };

  submit = () => {
    const { questionID, newQuestionOptimalResponse, prompt, blankAllowed, caseInsensitive, cues, instructions, conceptID, flag, cuesLabel } = this.state
    const { action } = this.props
    const data = {
      prompt: prompt,
      blankAllowed: blankAllowed ? blankAllowed : false,
      caseInsensitive: caseInsensitive ? caseInsensitive : false,
      cues: cues.split(','),
      instructions: instructions,
      conceptID: conceptID,
      flag: flag ? flag : 'alpha',
      cuesLabel: cuesLabel
    };
    data.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
    if (this.props.new && data.prompt != '') {
      action(
        data,
        {
          text: newQuestionOptimalResponse.trim(),
          optimal: true,
          count: 0,
          feedback: "That's a strong sentence!"
        }
      );
    } else {
      action(data, newQuestionOptimalResponse);
    }
  };

  toggleQuestionBlankAllowed = () => {
    this.setState({blankAllowed: !this.state.blankAllowed});
  };

  toggleQuestionCaseInsensitive = () => {
    this.setState(prevState => ({caseInsensitive: !prevState.caseInsensitive}));
  };

  renderButtonText = () => {
    return this.props.editing ? 'Submit Edit' : 'Add Question';
  }

  renderOptimalField = () => {
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

  render() {
    const { instructions } = this.state
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
          <textarea className="input" onChange={this.handleInstructionsChange} placeholder="Type '/' for list of instructions" ref="instructions" type="text" value={instructions} />
        </p>
        {this.renderDefaultInstructions()}
        <label className="label">Cues Label (default is "joining words"/"joining word" for single cues, enter a space to have no label)</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesLabelChange} type="text" value={this.state.cuesLabel} />
        </p>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" onChange={this.handleCuesChange} type="text" value={this.state.cues} />
        </p>
        {this.renderOptimalField()}
        <label className="label">Blank Allowed?</label>
        <p className="control">
          <input checked={this.state.blankAllowed} onClick={this.toggleQuestionBlankAllowed} type="checkbox" />
        </p>
        <label className="label">Case Insensitive?</label>
        <p className="control">
          <input checked={this.state.caseInsensitive} onClick={this.toggleQuestionCaseInsensitive} type="checkbox" />
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


export default FillInBlankForm;
