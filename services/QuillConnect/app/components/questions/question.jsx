import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Modal, UploadOptimalResponses } from 'quill-component-library/dist/componentLibrary';
import activeComponent from 'react-router-active-component';

import EditForm from './questionForm.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import Cues from '../renderForQuestions/cues.jsx';
import {
  submitResponse,
  submitOptimalResponses
} from '../../actions/responses';
import questionActions from '../../actions/questions';
import C from '../../constants';

const icon = 'https://assets.quill.org/images/icons/question_icon.svg'

const NavLink = activeComponent('li');

const Question = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      addingNewResponse: false,
      uploadingNewOptimalResponses: false
    };
  },

  startEditingQuestion() {
    this.props.dispatch(questionActions.startQuestionEdit(this.props.params.questionID));
  },

  cancelEditingQuestion() {
    this.props.dispatch(questionActions.cancelQuestionEdit(this.props.params.questionID));
  },

  saveQuestionEdits(vals) {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.params.questionID, vals));
  },

  submitOptimalResponses(responseStrings) {
    const conceptUID = this.getQuestion().conceptID
    this.props.dispatch(
      submitOptimalResponses(this.props.params.questionID, conceptUID, responseStrings)
    )
    this.setState({ uploadingNewOptimalResponses: false, })
  },

  getQuestion() {
    const { data, } = this.props.questions;
    const { questionID, } = this.props.params;
    return data[questionID];
  },

  startAddingNewResponse() {
    this.setState({ addingNewResponse: true, });
  },

  startUploadingNewOptimalResponses() {
    this.setState({ uploadingNewOptimalResponses: true, });
  },

  submitResponse() {
    const newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked,
        questionUID: this.props.params.questionID,
        gradeIndex: `human${this.props.params.questionID}`,
        count: 1,
      },
    };
    this.refs.newResponseText.value = null;
    this.refs.newResponseFeedback.value = null;
    this.refs.newResponseOptimal.checked = false;
    // this.refs.boilerplate.value = null;
    this.props.dispatch(submitResponse(newResp.vals));
    this.setState({ addingNewResponse: false, });
  },

  boilerplateCategoriesToOptions() {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
      ));
  },

  boilerplateSpecificFeedbackToOptions(selectedCategory) {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
      ));
  },

  chooseBoilerplateCategory(e) {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  },

  chooseSpecificBoilerplateFeedback(e) {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.refs.newResponseFeedback.value = '';
    } else {
      this.refs.newResponseFeedback.value = e.target.value;
    }
  },

  renderBoilerplateCategoryDropdown(onChangeEvent) {
    const style = { marginRight: '20px', };
    return (
      <span className="select" style={style}>
        <select className="boilerplate-feedback-dropdown" onChange={onChangeEvent}>
          <option className="boilerplate-feedback-dropdown-option">Select boilerplate feedback category</option>
          {this.boilerplateCategoriesToOptions()}
        </select>
      </span>
    );
  },

  renderBoilerplateCategoryOptionsDropdown(onChangeEvent, description) {
    const selectedCategory = _.find(getBoilerplateFeedback(), { description, });
    if (selectedCategory) {
      return (
        <span className="select">
          <select className="boilerplate-feedback-dropdown" onChange={onChangeEvent} ref="boilerplate">
            <option className="boilerplate-feedback-dropdown-option">Select specific boilerplate feedback</option>
            {this.boilerplateSpecificFeedbackToOptions(selectedCategory)}
          </select>
        </span>
      );
    } else {
      return (<span />);
    }
  },

  renderNewResponseForm() {
    if (this.state.addingNewResponse) {
      return (
        <Modal close={() => { this.setState({ addingNewResponse: false, }); }}>
          <div className="box">
            <h6 className="control subtitle">Add a new response</h6>
            <label className="label">Response text</label>
            <p className="control">
              <input className="input" ref="newResponseText" type="text" />
            </p>
            <label className="label">Feedback</label>
            <p className="control">
              <input className="input" ref="newResponseFeedback" type="text" />
            </p>
            <label className="label">Boilerplate feedback</label>
            <div className="boilerplate-feedback-dropdown-container">
              {this.renderBoilerplateCategoryDropdown(this.chooseBoilerplateCategory)}
              {this.renderBoilerplateCategoryOptionsDropdown(this.chooseSpecificBoilerplateFeedback, this.state.selectedBoilerplateCategory)}
            </div>
            <br />
            <p className="control">
              <label className="checkbox">
                <input ref="newResponseOptimal" type="checkbox" />
                Optimal?
              </label>
            </p>
            <button className="button is-primary" onClick={this.submitResponse}>Add Response</button>
          </div>
        </Modal>
      );
    }
  },

  renderUploadNewOptimalResponsesForm() {
    if (this.state.uploadingNewOptimalResponses) {
      return (
        <Modal close={() => { this.setState({ uploadingNewOptimalResponses: false, }); }}>
          <UploadOptimalResponses submitOptimalResponses={this.submitOptimalResponses} />
        </Modal>
      );
    }
  },

  renderEditForm() {
    const { data, } = this.props.questions,
      { questionID, } = this.props.params;
    const question = (data[questionID]);
    if (this.props.questions.states[questionID] === C.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditForm concepts={this.props.concepts} itemLevels={this.props.itemLevels} question={question} submit={this.saveQuestionEdits} />
        </Modal>
      );
    }
  },

  isLoading() {
    const loadingData = this.props.questions.hasreceiveddata === false;
    return loadingData;
  },

  render() {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (data[questionID]) {
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>

      const { instructions, cues } = data[questionID]
      let instructionText = 'Combine the sentences into one sentence.'
      if (instructions) {
        instructionText = instructions
      } else if (cues && cues.length > 0 && cues[0] !== "") {
        if (cues.length === 1) {
          instructionText = "Combine the sentences into one sentence. Use the joining word."
        } else {
          instructionText = "Combine the sentences into one sentence. Use one of the joining words."
        }
      }
      return (
        <div>
          {this.renderEditForm()}
          {this.renderNewResponseForm()}
          {this.renderUploadNewOptimalResponsesForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
            <h4 className="title" style={{color: '#00c2a2'}}>Flag: {data[questionID].flag}</h4>
          </div>
          <Cues
            displayArrowAndText={true}
            getQuestion={this.getQuestion}
          />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{instructionText}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>

            <a className="button is-outlined is-primary" onClick={this.startEditingQuestion}>Edit Question</a>
            <a className="button is-outlined is-primary" onClick={this.startAddingNewResponse}>Add New Response</a>
            <a className="button is-outlined is-primary" onClick={this.startUploadingNewOptimalResponses}>Upload Optimal Responses</a>
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/questions/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`admin/questions/${questionID}/test`}>Play Question</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/choose-model`}>{data[questionID].modelConceptUID ? 'Edit' : 'Add'} Model Concept</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/focus-points`}>{data[questionID].focusPoints ? 'Edit' : 'Add'} Focus Points</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/incorrect-sequences`}>{data[questionID].incorrectSequences ? 'Edit' : 'Add'} Incorrect Sequences</NavLink>
              {activeLink}
            </ul>
          </div>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <p>404: No Question Found</p>
      );
    }
  },
});

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    itemLevels: state.itemLevels,
    routing: state.routing,
    massEdit: state.massEdit
  };
}

export default connect(select)(Question);
