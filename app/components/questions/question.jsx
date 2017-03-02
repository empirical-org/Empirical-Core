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
import ResponseComponent from './responseComponent.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import TextEditor from './textEditor.jsx';
import ConceptSelector from '../shared/conceptSelector.jsx';
import massEdit from '../../actions/massEdit';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  submitNewConceptResult
} from '../../actions/responses';

const labels = ['Human Optimal', 'Human Sub-Optimal', 'Algorithm Optimal', 'Algorithm Sub-Optimal', 'Unmatched'];
const colors = ['#81c784', '#ffb74d', '#ba68c8', '#5171A5', '#e57373'];

const Question = React.createClass({

  getInitialState() {
    return {
      selectedBoilerplateCategory: '',
      selectedMassEditBoilerplateCategory: '',
      responses: [],
      loadedResponses: false,
      selectedResponses: [],
      newMassEditConceptResultConceptUID: '',
      newMassEditConceptResultCorrect: false,
      massEditSummaryListDisplay: 'none',
      massEditSummaryListButtonText: 'Expand List',
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
          loadedResponses: true
        })
      }
    )
  },

  componentWillUnmount() {
    console.log('Unmounting');
    const { questionID, } = this.props.params;
    this.props.dispatch(stopListeningToResponses(questionID));
    this.clearResponsesFromMassEditArray();
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

  getResponses() {
    // const { questionID, } = this.props.params;
    // return this.props.responses.data[questionID];
    return this.state.responses
  },

  getResponse(responseID) {
    const { data, states, } = this.props.questions,
      { questionID, } = this.props.params;
    const responses = hashToCollection(this.getResponses());
    return _.find(responses, { key: responseID, });
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
      },
      questionID: this.props.params.questionID,
    };
    this.refs.newResponseText.value = null;
    this.refs.newResponseFeedback.value = null;
    this.refs.newResponseOptimal.checked = false;
    this.refs.boilerplate.value = null;
    this.props.dispatch(questionActions.submitNewResponse(newResp.questionID, newResp.vals)); // fIXME
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

  chooseMassEditBoilerplateCategory(e) {
    this.setState({ selectedMassEditBoilerplateCategory: e.target.value, });
  },

  chooseMassEditSpecificBoilerplateFeedback(e) {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.setState({ selectedMassEditBoilerplate: '' });
    } else {
      this.setState({ selectedMassEditBoilerplate: e.target.value });
    }
  },

  clearResponsesFromMassEditArray() {
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
  },

  removeResponseFromMassEditArray(responseKey) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  },

  incrementAllResponsesInMassEditArray() {
    let selectedResponses = this.props.massEdit.selectedResponses;
    selectedResponses.forEach((response) => this.props.dispatch(incrementResponseCount(this.props.params.questionID, response)));
  },

  updateAllResponsesInMassEditArray() {
    let selectedResponses = this.props.massEdit.selectedResponses;
    const newResp = {
      weak: false,
      feedback: this.state.massEditFeedback,
      optimal: this.refs.massEditOptimal.checked,
    };
    selectedResponses.forEach((response) => this.props.dispatch(submitResponseEdit(response, newResp)));
  },

  deleteAllResponsesInMassEditArray() {
    let selectedResponses = this.props.massEdit.selectedResponses;
    if(window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
      selectedResponses.forEach((response) => this.props.dispatch(deleteResponse(this.props.params.questionID, response)));
      this.clearResponsesFromMassEditArray();
    }
  },

  addMassEditConceptResults() {
    let selectedResponses = this.props.massEdit.selectedResponses;
    selectedResponses.forEach((response) => {
      let conceptResultUidsArrayForResponse = Object.keys(this.state.responses[response].conceptResults || {}).map((concept) => this.state.responses[response].conceptResults[concept].conceptUID);
      if(!conceptResultUidsArrayForResponse.includes(this.state.newMassEditConceptResultConceptUID)) {
        this.props.dispatch(submitNewConceptResult(this.props.params.questionID, response, {
          conceptUID: this.state.newMassEditConceptResultConceptUID,
          correct: this.state.newMassEditConceptResultCorrect
        }));
      }
    });
  },

  handleMassEditFeedbackTextChange(value) {
    this.setState({ massEditFeedback: value })
  },

  selectMassEditConceptForResult(e) {
    this.setState({newMassEditConceptResultConceptUID: e.value});
  },

  updateMassEditConceptResultCorrect() {
    this.setState({newMassEditConceptResultCorrect: this.refs.massEditConceptResultsCorrect.checked});
  },

  toggleMassEditSummaryList() {
    let display = 'none';
    let text = 'Expand List';
    if(this.state.massEditSummaryListButtonText == 'Expand List') {
      display = 'block';
      text = 'Collapse List';
    }
    this.setState({
      massEditSummaryListDisplay: display,
      massEditSummaryListButtonText: text,
    })
  },

  renderMassEditSummaryListResponse(response) {
    return (
      <p><input type="checkbox" defaultChecked={true} checked={true} style={{marginRight: '0.5em' }} onClick={() => this.removeResponseFromMassEditArray(response)} />{this.getResponses()[response].text}</p>
    );
  },

  renderMassEditSummaryList() {
    const summaryResponses = this.props.massEdit.selectedResponses.map((response) => {
      return this.renderMassEditSummaryListResponse(response)
    });
    return (<div className="content">{summaryResponses}</div>);
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
    const selectedCategory = _.find(getBoilerplateFeedback(), { description: description, });
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
    return (
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
    );
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

  renderMassEditForm() {
    let selectedResponses = this.props.massEdit.selectedResponses;
    if(selectedResponses.length > 1) {
      return (
        <div>
          <div className="card is-fullwidth has-bottom-margin has-top-margin">
            <header className="card-content expanded">
              <div className="content">
                <h1 className="title is-3" style={{marginBottom: '0'}}><strong style={{fontWeight: '700'}}>{selectedResponses.length}</strong> Responses Selected for Mass Editing:</h1>
              </div>
            </header>
            <div className="card-content" style={{display: this.state.massEditSummaryListDisplay}}>
              {this.renderMassEditSummaryList()}
            </div>
            <footer className="card-footer">
              <a className="card-footer-item" onClick={() => this.toggleMassEditSummaryList()}>{this.state.massEditSummaryListButtonText}</a>
              <a className="card-footer-item" onClick={() => this.clearResponsesFromMassEditArray()}>Deselect All</a>
              <a className="card-footer-item" onClick={() => this.deleteAllResponsesInMassEditArray()}>Delete All</a>
            </footer>
          </div>
          <div className="card is-fullwidth has-bottom-margin has-top-margin">
            <header className="card-content expanded">
                <h1 className="title is-3" style={{display: 'inline-block'}}>Modify Feedback for <strong style={{fontWeight: '700'}}>{selectedResponses.length}</strong> Responses</h1>
            </header>
            <div className="card-content">
              <div className="content">
                <h3>FEEDBACK <span style={{fontSize: '0.7em', marginLeft: '0.75em'}}>⚠️️ All other feedback associated with selected responses will be overwritten ⚠️️</span></h3>
                <TextEditor text={this.state.massEditFeedback || ''} handleTextChange={this.handleMassEditFeedbackTextChange} boilerplate={this.state.selectedMassEditBoilerplate} />
              </div>
              <div className="content">
                <h4>Boilerplate Feedback</h4>
                <div className="boilerplate-feedback-dropdown-container">
                  {this.renderBoilerplateCategoryDropdown(this.chooseMassEditBoilerplateCategory)}
                  {this.renderBoilerplateCategoryOptionsDropdown(this.chooseMassEditSpecificBoilerplateFeedback, this.state.selectedMassEditBoilerplateCategory)}
                </div>
              </div>
              <div className="content">
                <label className="checkbox">
                  <h3><input ref="massEditOptimal" defaultChecked={false} type="checkbox" /> OPTIMAL <span style={{fontSize: '0.7em', marginLeft: '0.75em'}}>⚠️️ All selected responses will be marked with this optimality ⚠️️</span></h3>
                </label>
              </div>
            </div>
            <footer className="card-footer">
              {/* <a className="card-footer-item" onClick={() => this.incrementAllResponsesInMassEditArray()}>Increment</a> */}
              <a className="card-footer-item" onClick={() => this.updateAllResponsesInMassEditArray()}>Update Feedback</a>
              {/* <a className="card-footer-item" onClick={() => alert('This has not been implemented yet.')}>Rematch</a>  */}
            </footer>
          </div>
          <div className="card is-fullwidth has-bottom-margin has-top-margin">
            <header className="card-content expanded">
                <h1 className="title is-3" style={{display: 'inline-block'}}>Add Concept Results for <strong style={{fontWeight: '700'}}>{selectedResponses.length}</strong> Responses</h1>
            </header>
            <div className="card-content">
              <div className="content">
                <h3>ADD CONCEPT RESULTS <span style={{fontSize: '0.7em', marginLeft: '0.75em'}}>⚠️️ This concept result will be added to all selected responses ⚠️️</span></h3>
                <ConceptSelector currentConceptUID={this.state.newMassEditConceptResultConceptUID} handleSelectorChange={this.selectMassEditConceptForResult} />
                <br />
                <label className="checkbox">
                  <h3><input ref="massEditConceptResultsCorrect" defaultChecked={false} type="checkbox" onChange={() => this.updateMassEditConceptResultCorrect()} /> CORRECT</h3>
                </label>
              </div>
            </div>
            <footer className="card-footer">
              <a className="card-footer-item" onClick={() => this.addMassEditConceptResults()}>Add Concept Result</a>
            </footer>
          </div>
        </div>
      )
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
          <Link to={'admin/questions'}> Return to All Questions </Link>
          <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
          <h6 className="subtitle">{responses.length} Responses</h6>
          <Link to={`play/questions/${questionID}`} className="button is-outlined is-primary">Play Question</Link> <Link to={`/results/questions/${questionID}`} className="button is-outlined is-primary">View Only</Link><br /><br />
          <Chart data={_.values(this.formatForPieChart())} />
          <p className="control button-group">
            <button className="button is-info" onClick={this.startEditingQuestion}>Edit Question</button>
            <Link to={'admin/questions'} className="button is-danger" onClick={this.deleteQuestion}>Delete Question</Link>
          </p>
          {this.renderNewResponseForm()}
          <ResponseComponent
            question={data[questionID]}
            responses={this.getResponses()}
            questionID={questionID}
            states={states}
            dispatch={this.props.dispatch}
            admin
          />
        {this.renderMassEditForm()}
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
    // responses: state.responses,
    itemLevels: state.itemLevels,
    routing: state.routing,
    massEdit: state.massEdit
  };
}

export default connect(select)(Question);
