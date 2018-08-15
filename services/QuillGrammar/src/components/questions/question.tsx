import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import * as questionActions from '../../actions/questions';
import _ from 'underscore';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import EditForm from './questionForm';
import { ActionTypes } from '../../actions/actionTypes'
import getBoilerplateFeedback from './boilerplateFeedback';
const icon = 'https://assets.quill.org/images/icons/question_icon.svg'
import {
  submitResponse
} from '../../actions/responses';
import activeComponent from 'react-router-active-component';
import { Route, Switch, withRouter } from "react-router-dom";
import ResponseComponentWrapper from './responseRouteWrapper'
import TestQuestion from './testQuestion'

class AdminQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      addingNewResponse: false,
    }

    this.startEditingQuestion = this.startEditingQuestion.bind(this)
    this.cancelEditingQuestion = this.cancelEditingQuestion.bind(this)
    this.saveQuestionEdits = this.saveQuestionEdits.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.startAddingNewResponse = this.startAddingNewResponse.bind(this)
    this.submitResponse = this.submitResponse.bind(this)
    this.boilerplateCategoriesToOptions = this.boilerplateCategoriesToOptions.bind(this)
    this.boilerplateSpecificFeedbackToOptions = this.boilerplateSpecificFeedbackToOptions.bind(this)
    this.chooseBoilerplateCategory = this.chooseBoilerplateCategory.bind(this)
    this.chooseSpecificBoilerplateFeedback = this.chooseSpecificBoilerplateFeedback.bind(this)
    this.renderBoilerplateCategoryDropdown = this.renderBoilerplateCategoryDropdown.bind(this)
    this.renderBoilerplateCategoryOptionsDropdown = this.renderBoilerplateCategoryOptionsDropdown.bind(this)
    this.renderNewResponseForm = this.renderNewResponseForm.bind(this)
    this.renderEditForm = this.renderEditForm.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }

  startEditingQuestion() {
    this.props.dispatch(questionActions.startQuestionEdit(this.props.match.params.questionID));
  }

  cancelEditingQuestion() {
    this.props.dispatch(questionActions.cancelQuestionEdit(this.props.match.params.questionID));
  }

  saveQuestionEdits(vals) {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.match.params.questionID, vals));
  }

  getQuestion() {
    const { data, } = this.props.questions;
    const { questionID, } = this.props.match.params;
    return data[questionID];
  }

  startAddingNewResponse() {
    this.setState({ addingNewResponse: true, });
  }

  submitResponse() {
    const newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked,
        questionUID: this.props.match.params.questionID,
        gradeIndex: `human${this.props.match.params.questionID}`,
        count: 1,
      }
    };
    this.refs.newResponseText.value = null;
    this.refs.newResponseFeedback.value = null;
    this.refs.newResponseOptimal.checked = false;
    // this.refs.boilerplate.value = null;
    this.props.dispatch(submitResponse(newResp.vals));
    this.setState({ addingNewResponse: false, });
  }

  boilerplateCategoriesToOptions() {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
      ));
  }

  boilerplateSpecificFeedbackToOptions(selectedCategory) {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
      ));
  }

  chooseBoilerplateCategory(e) {
    this.setState({ selectedBoilerplateCategory: e.target.value, });
  }

  chooseSpecificBoilerplateFeedback(e) {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.refs.newResponseFeedback.value = '';
    } else {
      this.refs.newResponseFeedback.value = e.target.value;
    }
  }

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

  renderNewResponseForm() {
    if (this.state.addingNewResponse) {
      return (
        <Modal close={() => { this.setState({ addingNewResponse: false, }); }}>
          <div className="box">
            <h6 className="control subtitle">Add a new response</h6>
            <label className="label">Response text</label>
            <p className="control">
              <input className="input" type="text" ref="newResponseText" />
            </p>
            <label className="label">Feedback</label>
            <p className="control">
              <input className="input" type="text" ref="newResponseFeedback" />
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
  }

  renderEditForm() {
    const { data, } = this.props.questions,
      { questionID, } = this.props.match.params;
    const question = (data[questionID]);
    if (this.props.questions.states[questionID] === ActionTypes.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditForm question={question} submit={this.saveQuestionEdits} concepts={this.props.concepts} />
        </Modal>
      );
    }
  }

  isLoading() {
    const loadingData = this.props.questions.hasreceiveddata === false;
    return loadingData;
  }

  render() {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.match.params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (data[questionID]) {
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <li activeClassName="is-active" to={`/admin/questions/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>

      return (
        <div>
          {this.renderEditForm()}
          {this.renderNewResponseForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }}/>
            <h4 style={{color: '#00c2a2'}} className="title">Flag: {data[questionID].flag}</h4>
          </div>
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Correct the underlined error in the sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>

            <a className="button is-outlined is-primary" onClick={this.startEditingQuestion}>Edit Question</a>
            <a className="button is-outlined is-primary" onClick={this.startAddingNewResponse}>Add New Response</a>
          </p>
          <div className="tabs">
            <ul>
              <li><Link activeClassName="is-active" to={`/admin/questions/${questionID}/responses`}>Responses</Link></li>
              <li><Link activeClassName="is-active" to={`/admin/questions/${questionID}/test`}>Play Question</Link></li>
              {activeLink}
            </ul>
          </div>
          {this.props.children}
          <Switch>
            <Route path={`/admin/questions/:questionID/responses`} component={ResponseComponentWrapper} questionID={questionID}/>
            <Route path={`/admin/questions/:questionID/test`} component={TestQuestion}/>
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

export default withRouter(connect(select)(AdminQuestion));
