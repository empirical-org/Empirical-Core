import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Modal, UploadOptimalResponses } from 'quill-component-library/dist/componentLibrary';
import activeComponent from 'react-router-active-component';

import EditForm from './questionForm.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import Cues from '../renderForQuestions/cues.jsx';
import questionActions from '../../actions/questions';
import {
  submitResponse,
  submitOptimalResponses
} from '../../actions/responses';
import C from '../../constants';

const NavLink = activeComponent('li');
const icon = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      addingNewResponse: false,
      uploadingNewOptimalResponses: false
    }
  }

  handleClickStartEditingQuestion = () => {
    const { dispatch, params, } = this.props
    dispatch(questionActions.startQuestionEdit(params.questionID));
  }

  cancelEditingQuestion = () => {
    const { dispatch, params, } = this.props
    dispatch(questionActions.cancelQuestionEdit(params.questionID));
  }

  saveQuestionEdits(vals) {
    const { dispatch, params, } = this.props
    dispatch(questionActions.submitQuestionEdit(params.questionID, vals));
  }

  submitOptimalResponses(responseStrings) {
    const { dispatch, params, } = this.props
    const conceptUID = this.getQuestion().conceptID
    dispatch(
      submitOptimalResponses(params.questionID, conceptUID, responseStrings)
    )
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  getQuestion = () => {
    const { dispatch, params, } = this.props
    const { data, } = questions;
    const { questionID, } = params;
    return data[questionID];
  }

  handleClickAddNewResponse = () => {
    this.setState({ addingNewResponse: true, });
  }

  handleClickUploadOptimalResponses = () => {
    this.setState({ uploadingNewOptimalResponses: true, });
  }

  submitResponse = () => {
    const { params, dispatch, } = this.props

    const newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked,
        questionUID: params.questionID,
        gradeIndex: `human${params.questionID}`,
        count: 1,
      }
    };
    this.refs.newResponseText.value = null;
    this.refs.newResponseFeedback.value = null;
    this.refs.newResponseOptimal.checked = false;
    dispatch(submitResponse(newResp.vals));
    this.setState({ addingNewResponse: false, });
  }

  boilerplateCategoriesToOptions = () => {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option" key={category.description} >{category.description}</option>
    ));
  }

  boilerplateSpecificFeedbackToOptions = (selectedCategory) =>{
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option" key={childFeedback.description}>{childFeedback.description}</option>
    ));
  }

  chooseBoilerplateCategory = (e) => {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  }

  chooseSpecificBoilerplateFeedback(e) {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.refs.newResponseFeedback.value = '';
    } else {
      this.refs.newResponseFeedback.value = e.target.value;
    }
  }

  onCloseUploadOptimalResponsesModal = () => this.setState({ uploadingNewOptimalResponses: false })

  onCloseNewResponseModal = () => this.setState({ addingNewResponse: false, })

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
  }

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
  }

  renderNewResponseForm = () => {
    const { addingNewResponse, selectedBoilerplateCategory, } = this.state
    if (!addingNewResponse ) { return }

    return (
      <Modal close={this.onCloseNewResponseModal}>
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
            {this.renderBoilerplateCategoryOptionsDropdown(this.chooseSpecificBoilerplateFeedback, selectedBoilerplateCategory)}
          </div>
          <br />
          <p className="control">
            <label className="checkbox">
              <input ref="newResponseOptimal" type="checkbox" />
              Optimal?
            </label>
          </p>
          <button className="button is-primary" onClick={this.handleClickAddNewResponse} type="button">Add Response</button>
        </div>
      </Modal>
    );
  }

  renderUploadNewOptimalResponsesForm = () => {
    const { uploadingNewOptimalResponses, } = this.state
    if (!uploadingNewOptimalResponses) { return }

    return (
      <Modal close={this.onCloseUploadOptimalResponsesModal}>
        <UploadOptimalResponses submitOptimalResponses={this.submitOptimalResponses} />
      </Modal>
    );
  }

  renderEditForm = () => {
    const { questions, params, concepts, itemLevels, } = this.props
    const { data, } = questions
    const { questionID, } = params;
    const question = (data[questionID]);
    if (questions.states[questionID] === C.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditForm concepts={concepts} itemLevels={itemLevels} question={question} submit={this.saveQuestionEdits} />
        </Modal>
      );
    }
  }

  isLoading = () => {
    const { questions, } = this.props
    return !questions.hasreceiveddata;
  }

  render() {
    const { questions, params, massEdit, children, } = this.props
    const { data, states, } = questions
    const  { questionID, } = params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (data[questionID]) {
      const activeLink = massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/mass-edit`}>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({massEdit.numSelectedResponses})</li>

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
            <img alt="Directions Icon" className="info" src={icon} />
            <p>{instructionText}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>

            <a className="button is-outlined is-primary" onClick={this.handleClickStartEditingQuestion}>Edit Question</a>
            <a className="button is-outlined is-primary" onClick={this.handleClickAddNewResponse}>Add New Response</a>
            <a className="button is-outlined is-primary" onClick={this.handleClickUploadOptimalResponses}>Upload Optimal Responses</a>
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
          {children}
        </div>
      );
    } else {
      return (
        <p>404: No Question Found</p>
      );
    }
  }
}

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
