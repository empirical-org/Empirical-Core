import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import EditForm from './questionForm.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import Cues from '../renderForQuestions/cues.tsx';
import questionActions from '../../actions/questions';
import {
  submitResponse,
  submitOptimalResponses
} from '../../actions/responses';
import C from '../../constants';
import FocusPointsContainer from '../focusPoints/focusPointsContainer.jsx';
import EditFocusPointsContainer from '../focusPoints/editFocusPointsContainer.jsx';
import NewFocusPointsContainer from '../focusPoints/newFocusPointsContainer.jsx';
import IncorrectSequenceContainer from '../incorrectSequence/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from '../incorrectSequence/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from '../incorrectSequence/newIncorrectSequenceContainer.jsx';
import ResponseComponentWrapper from './responseRouteWrapper.jsx';
import MassEditContainer from './massEditContainer.jsx';
import ChooseModelContainer from './chooseModelContainer.jsx';
import TestQuestionContainer from './testQuestion';
import { Modal, UploadOptimalResponses } from '../../../Shared/index';

const icon = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/direction.svg`

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
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params;
    dispatch(questionActions.startQuestionEdit(questionID));
  }

  cancelEditingQuestion = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params;
    dispatch(questionActions.cancelQuestionEdit(questionID));
  }

  saveQuestionEdits = (vals) => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params;
    dispatch(questionActions.submitQuestionEdit(questionID, vals));
  }


  submitOptimalResponses = (responses) => {
    const { dispatch, match, concepts, } = this.props
    const { params } = match
    const { questionID } = params;
    const conceptUID = this.getQuestion().conceptID
    dispatch(
      submitOptimalResponses(questionID, conceptUID, responses, concepts)
    )
    this.setState({ uploadingNewOptimalResponses: false, })
  }

  getQuestion = () => {
    const { match, questions, } = this.props
    const { params } = match
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

  handleSubmitResponse = () => {
    const { match, dispatch, } = this.props
    const { params } = match
    const { questionID } = params

    const newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked,
        questionUID: questionID,
        gradeIndex: `human${questionID}`,
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

  boilerplateSpecificFeedbackToOptions = (selectedCategory) => {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option" key={childFeedback.description}>{childFeedback.description}</option>
    ));
  }

  chooseBoilerplateCategory = (e) => {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  }

  chooseSpecificBoilerplateFeedback = (e) => {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.refs.newResponseFeedback.value = '';
    } else {
      this.refs.newResponseFeedback.value = e.target.value;
    }
  }

  onCloseUploadOptimalResponsesModal = () => this.setState({ uploadingNewOptimalResponses: false })

  onCloseNewResponseModal = () => this.setState({ addingNewResponse: false, })

  renderBoilerplateCategoryDropdown = (onChangeEvent) => {
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

  renderBoilerplateCategoryOptionsDropdown = (onChangeEvent, description) => {
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
    if (!addingNewResponse) { return }

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
          <button className="button is-primary" onClick={this.handleSubmitResponse} type="button">Add Response</button>
        </div>
      </Modal>
    );
  }

  renderEditForm = () => {
    const { questions, match, concepts } = this.props
    const { params } = match
    const { data } = questions
    const { questionID, } = params;
    const question = (data[questionID]);
    if (questions.states[questionID] === C.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditForm concepts={concepts} question={question} submit={this.saveQuestionEdits} />
        </Modal>
      );
    }
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

  isLoading = () => {
    const { questions, } = this.props
    return !questions.hasreceiveddata;
  }

  render() {
    const { questions, match, massEdit, children, } = this.props
    const { params } = match;
    const { data } = questions
    const { questionID, } = params;
    const question = this.getQuestion();
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (data[questionID]) {
      const activeLink = massEdit.numSelectedResponses > 1
        ? <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/mass-edit`}>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
        : <li style={{ color: "#a2a1a1" }}>Mass Edit ({massEdit.numSelectedResponses})</li>

      return (
        <div className="admin-container">
          {this.renderEditForm()}
          {this.renderNewResponseForm()}
          {this.renderUploadNewOptimalResponsesForm()}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
            <h4 className="title" style={{ color: '#00c2a2' }}>Flag: {data[questionID].flag}</h4>
          </div>
          <Cues
            displayArrowAndText={true}
            question={question}
          />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img alt="Directions Icon" className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            <a className="button is-outlined is-primary" onClick={this.handleClickStartEditingQuestion}>Edit Question</a>
            <a className="button is-outlined is-primary" onClick={this.handleClickAddNewResponse}>Add New Response</a>
            <a className="button is-outlined is-primary" onClick={this.handleClickUploadOptimalResponses}>Upload Optimal Responses</a>
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/test`}>Play Question</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/choose-model`}>{data[questionID].modelConceptUID ? 'Edit' : 'Add'} Model Concept</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/focus-points`}>{data[questionID].focusPoints ? 'Edit' : 'Add'} Focus Points</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/questions/${questionID}/incorrect-sequences`}>{data[questionID].incorrectSequences ? 'Edit' : 'Add'} Incorrect Sequences</NavLink>
              {activeLink}
            </ul>
          </div>
          <Switch>
            <Route component={EditIncorrectSequenceContainer} path="/admin/questions/:questionID/incorrect-sequences/:incorrectSequenceID/edit" />
            <Route component={NewIncorrectSequenceContainer} path="/admin/questions/:questionID/incorrect-sequences/new" />
            <Route component={IncorrectSequenceContainer} path="/admin/questions/:questionID/incorrect-sequences" />
            <Route component={EditFocusPointsContainer} path="/admin/questions/:questionID/focus-points/:focusPointID/edit" />
            <Route component={NewFocusPointsContainer} path="/admin/questions/:questionID/focus-points/new" />
            <Route component={FocusPointsContainer} path="/admin/questions/:questionID/focus-points" />
            <Route component={TestQuestionContainer} path="/admin/questions/:questionID/test" />
            <Route component={ChooseModelContainer} path="/admin/questions/:questionID/choose-model" />
            <Route component={MassEditContainer} path="/admin/questions/:questionID/mass-edit" />
            <Route component={ResponseComponentWrapper} path="/admin/questions/:questionID/responses" />
          </Switch>
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
    routing: state.routing,
    massEdit: state.massEdit
  };
}

export default withRouter(connect(select)(Question));
