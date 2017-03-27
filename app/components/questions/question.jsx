import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import questionActions from '../../actions/questions';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses';
import Modal from '../modal/modal.jsx';
import EditFrom from './questionForm.jsx';
import Response from './response.jsx';
import C from '../../constants';
import Chart from './pieChart.jsx';
import QuestionBar from './questionBar.jsx';
import ResponseComponent from './responseComponent.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import icon from '../../img/question_icon.svg';
import Cues from '../renderForQuestions/cues.jsx';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  submitNewConceptResult,
  deleteConceptResult,
  removeLinkToParentID,
  submitNewResponse
} from '../../actions/responses';

const labels = ['Human Optimal', 'Human Sub-Optimal', 'Algorithm Optimal', 'Algorithm Sub-Optimal', 'Unmatched'];
const colors = ['#81c784', '#ffb74d', '#ba68c8', '#5171A5', '#e57373'];

const Question = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      addingNewResponse: false,
    };
  },

  componentWillMount() {
    const { questionID, } = this.props.params;
    // this.props.dispatch(loadResponseDataAndListen(questionID));
    listenToResponsesWithCallback(
      questionID,
      (data) => {
        this.setState({
          responses: data,
          loadedResponses: true,
        });
      }
    );
  },

  componentWillUnmount() {
    console.log('Unmounting');
    const { questionID, } = this.props.params;
    this.props.dispatch(stopListeningToResponses(questionID));
  },

  deleteQuestion() {
    this.props.dispatch(questionActions.deleteQuestion(this.props.params.questionID));
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

  getQuestion() {
    const { data, } = this.props.questions;
    const { questionID, } = this.props.params;
    return data[questionID];
  },

  getResponses() {
    // const { questionID, } = this.props.params;
    // return this.props.responses.data[questionID];
    return this.state.responses;
  },

  getTotalAttempts() {
    return _.reduce(this.getResponses(), (memo, item) => memo + item.count, 0);
  },

  getResponse(responseID) {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.params;
    const responses = hashToCollection(this.getResponses());
    return _.find(responses, { key: responseID, });
  },

  startAddingNewResponse() {
    this.setState({ addingNewResponse: true, });
  },

  responsesWithStatus() {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.params;
    const responses = hashToCollection(this.getResponses());
    return responses.map((response) => {
      let statusCode;
      if (!response.feedback) {
        statusCode = 4;
      } else if (response.parentID) {
        const parentResponse = this.getResponse(response.parentID);
        statusCode = 3;
      } else {
        statusCode = (response.optimal ? 0 : 1);
      }
      response.statusCode = statusCode;
      return response;
    });
  },

  responsesGroupedByStatus() {
    return _.groupBy(this.responsesWithStatus(), 'statusCode');
  },

  responsesByStatusCodeAndResponseCount() {
    return _.mapObject(this.responsesGroupedByStatus(), (val, key) => _.reduce(val, (memo, resp) => memo + (resp.count || 0), 0));
  },

  formatForQuestionBar() {
    const totalResponseCount = Object.values(this.responsesByStatusCodeAndResponseCount()).reduce((a, b) => a + b);
    if (totalResponseCount == 0) {
      return _.mapObject(this.responsesByStatusCodeAndResponseCount(), (val, key) => ({
        value: 1 / Object.keys(this.responsesByStatusCodeAndResponseCount()).length * 100,
        color: '#eeeeee',
      }));
    } else {
      return _.mapObject(this.responsesByStatusCodeAndResponseCount(), (val, key) => ({
        value: val / totalResponseCount * 100,
        color: colors[key],
      }));
    }
  },

  formatForPieChart() {
    return _.mapObject(this.responsesByStatusCodeAndResponseCount(), (val, key) => ({
      value: val,
      label: labels[key],
      color: colors[key],
    }));
  },

  submitNewResponse() {
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
    this.props.dispatch(submitNewResponse(newResp.vals));
    this.setState({ addingNewResponse: false, });
  },

  gatherVisibleResponses() {
    const responses = this.responsesWithStatus();
    return _.filter(responses, response => this.state.visibleStatuses[labels[response.statusCode]]);
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
            <button className="button is-primary" onClick={this.submitNewResponse}>Add Response</button>
          </div>
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
          <EditFrom question={question} submit={this.saveQuestionEdits} itemLevels={this.props.itemLevels} concepts={this.props.concepts} />
        </Modal>
      );
    }
  },

  isLoading() {
    const loadingData = this.props.questions.hasreceiveddata === false;
    const loadingResponses = this.state.loadedResponses;
    return (loadingData || !loadingResponses);
  },

  render() {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (data[questionID]) {
      const responses = hashToCollection(this.getResponses());
      return (
        <div>
          {this.renderEditForm()}
          {this.renderNewResponseForm()}
          <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} style={{ marginBottom: 0, }} />
          <Cues getQuestion={this.getQuestion} />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{data[questionID].instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            <Link to={`play/questions/${questionID}`} className="button is-outlined is-primary">Play Question</Link>
            <Link to={`/results/questions/${questionID}`} className="button is-outlined is-primary">Share Page</Link>
            <button className="button is-outlined is-primary" onClick={this.startEditingQuestion}>Edit Question</button>
            <button className="button is-outlined is-primary" onClick={this.startAddingNewResponse}>Add New Response</button>
            <Link to={'admin/questions'} className="button is-outlined is-danger" onClick={this.deleteQuestion}>Delete Question</Link>
          </p>
          <QuestionBar data={_.values(this.formatForQuestionBar())} />
          <ResponseComponent
            question={data[questionID]}
            responses={this.getResponses()}
            questionID={questionID}
            states={states}
            dispatch={this.props.dispatch}
            admin
          />
          <div style={{ marginTop: 15, }}>
            <Chart data={_.values(this.formatForPieChart())} />
          </div>

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
  };
}

export default connect(select)(Question);
