import React, { Component } from 'react';
import { connect } from 'react-redux';
import {hashToCollection} from '../../libs/hashToCollection';
import fillInBlankActions from '../../actions/fillInBlank.js';
import TextEditor from '../questions/TextEditor.jsx';
import ConceptSelector from '../shared/conceptSelector.jsx'

class NewFillInBlank extends Component {
  constructor() {
    super();
    this.state = {
      prompt: '',
      newQuestionBlankAllowed: false
    }
    this.toggleQuestionBlankAllowed = this.toggleQuestionBlankAllowed.bind(this);
    this.handlePromptChange = this.handlePromptChange.bind(this);
    this.handleSelectorChange = this.handleSelectorChange.bind(this);
    this.submitNewQuestion = this.submitNewQuestion.bind(this);
  }

  submitNewQuestion(e) {
    e.preventDefault();
    if(this.state.prompt !== '') {
      this.props.dispatch(fillInBlankActions.submitNewQuestion(
        {
          prompt: this.state.prompt,
          blankAllowed: this.state.newQuestionBlankAllowed,
          cues: this.refs.cues.value.split(','),
          itemLevel: this.refs.itemLevel.value==="Select Item Level" ? "" : this.refs.itemLevel.value,
          instructions: this.refs.instructions.value,
          conceptID: this.state.conceptID
        },
        {
          text: this.refs.newQuestionOptimalResponse.value.trim(),
          optimal: true,
          count: 0,
          feedback: "That's a great sentence!"
        }
      ));
      this.refs.newQuestionPrompt.value = ''
      this.refs.newQuestionOptimalResponse.value = ''
      this.refs.instructions.value = ''
      this.refs.newQuestionBlankAllowed.checked = false;
      this.setState({newQuestionBlankAllowed: false});
      this.refs.newQuestionPrompt.focus()
    }
  }

  handlePromptChange(prompt) {
    this.setState({prompt});
  }

  handleSelectorChange(e) {
    this.setState({conceptID: e.value})
  }

  itemLevelToOptions() {
    return hashToCollection(this.props.itemLevels.data).map((level) => {
      return (
        <option>{level.name}</option>
      )
    });
  }

  toggleQuestionBlankAllowed() {
    this.setState({
      newQuestionBlankAllowed: !this.state.newQuestionBlankAllowed
    });
  }

  render() {
    console.log(this.state);
    return(
      <form className="box" onSubmit={this.submitNewQuestion}>
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor text={""} handleTextChange={this.handlePromptChange} />
        <br />
        <label className="label">Instructions for student</label>
        <p className="control">
          <textarea className="input" type="text" ref="instructions"></textarea>
        </p>
        <label className="label">Cues (seperated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" type="text" ref="cues"></input>
        </p>
        <label className="label">Optimal Response</label>
        <p className="control">
          <input className="input" type="text" ref="newQuestionOptimalResponse" onBlur={this.copyAnswerToPrefill}></input>
        </p>
        <label className="label" onClick={this.toggleQuestionBlankAllowed}>Blank Allowed?</label>
        <p className="control">
          <input type="checkbox" ref="newQuestionBlankAllowed" checked={this.state.newQuestionBlankAllowed} onClick={this.toggleQuestionBlankAllowed}></input>
        </p>
        <label className="label">Item level</label>
        <p className="control">
          <span className="select">
            <select ref="itemLevel">
              <option value="Select Item Level">Select Item Level</option>
              {this.itemLevelToOptions()}
            </select>
          </span>
        </p>
        <label className="label">Concept</label>
        <ConceptSelector currentConceptUID={this.state.concept} handleSelectorChange={this.handleSelectorChange} />
        <br />
        <button type="submit" className="button is-primary">Add Question</button>
      </form>
    )
  }
}

function select(state) {
  return {
    itemLevels: state.itemLevels,
    questions: state.questions
  };
}

export default connect(select)(NewFillInBlank);
