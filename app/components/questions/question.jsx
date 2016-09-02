import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Modal from '../modal/modal.jsx'
import EditFrom from './questionForm.jsx'
import Response from './response.jsx'
import C from '../../constants'
import Chart from './pieChart.jsx'
import ResponseComponent from './responseComponent.jsx'
import getBoilerplateFeedback from './boilerplateFeedback.jsx'

const labels = ["Human Optimal", "Human Sub-Optimal", "Algorithm Optimal", "Algorithm Sub-Optimal",  "Unmatched"]
const colors = ["#81c784", "#ffb74d", "#ba68c8", "#5171A5", "#e57373"]

const Question = React.createClass({

  getInitialState: function() {
    return {
      selectedBoilerplateCategory: ""
    }
  },

  deleteQuestion: function () {
    this.props.dispatch(questionActions.deleteQuestion(this.props.params.questionID))
  },

  startEditingQuestion: function () {
    this.props.dispatch(questionActions.startQuestionEdit(this.props.params.questionID))
  },

  cancelEditingQuestion: function () {
    this.props.dispatch(questionActions.cancelQuestionEdit(this.props.params.questionID))
  },

  saveQuestionEdits: function (vals) {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.params.questionID, vals))
  },

  getResponse: function (responseID) {
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    var responses = hashToCollection(data[questionID].responses)
    return _.find(responses, {key: responseID})
  },

  responsesWithStatus: function () {
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    var responses = hashToCollection(data[questionID].responses)
    return responses.map((response) => {
      var statusCode;
      if (!response.feedback) {
        statusCode = 4;
      } else if (!!response.parentID) {
        var parentResponse = this.getResponse(response.parentID)
        statusCode = 3;
      } else {
        statusCode = (response.optimal ? 0 : 1);
      }
      response.statusCode = statusCode
      return response
    })
  },

  responsesGroupedByStatus: function () {
    return _.groupBy(this.responsesWithStatus(), 'statusCode')
  },

  responsesByStatusCodeAndResponseCount: function () {
    return _.mapObject(this.responsesGroupedByStatus(), (val, key) => {
      return _.reduce(val, (memo, resp) => {

        return memo + (resp.count || 0)
      }, 0)
    })
  },

  formatForPieChart: function () {
    return _.mapObject(this.responsesByStatusCodeAndResponseCount(), (val, key) => {
      return {
        value: val,
        label: labels[key],
        color: colors[key]
      }
    })
  },

  submitNewResponse: function () {
    var newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked
      },
      questionID: this.props.params.questionID
    }
    this.refs.newResponseText.value = null;
    this.refs.newResponseFeedback.value = null;
    this.refs.newResponseOptimal.checked = false;
    this.refs.boilerplate.value = null;
    this.props.dispatch(questionActions.submitNewResponse(newResp.questionID, newResp.vals))
  },

  gatherVisibleResponses: function () {
    var responses = this.responsesWithStatus();
    return _.filter(responses, (response) => {
      return this.state.visibleStatuses[labels[response.statusCode]]
    });
  },

  boilerplateCategoriesToOptions: function() {
    return getBoilerplateFeedback().map((category) => {
      return (
        <option>{category.description}</option>
      )
    })
  },

  boilerplateSpecificFeedbackToOptions: function(selectedCategory) {
    return selectedCategory.children.map((childFeedback) => {
      return (
        <option>{childFeedback.description}</option>
      )
    })
  },

  chooseBoilerplateCategory: function(e) {
    this.setState({selectedBoilerplateCategory: e.target.value})
  },

  chooseSpecificBoilerplateFeedback: function(e) {
    if(e.target.value === "Select specific boilerplate feedback") {
      this.refs.newResponseFeedback.value = ""
    } else {
      this.refs.newResponseFeedback.value = e.target.value
    }
  },

  renderBoilerplateCategoryDropdown: function() {
    return (
        <p className="control boilerplate-feedback-dropdown">
        <span className="select">
          <select onChange={this.chooseBoilerplateCategory}>
            <option>Select boilerplate feedback category</option>
            {this.boilerplateCategoriesToOptions()}
          </select>
        </span>
      </p>
    )
  },

  renderBoilerplateCategoryOptionsDropdown: function() {
    const selectedCategory = _.find(getBoilerplateFeedback(), {description: this.state.selectedBoilerplateCategory});
    if(selectedCategory) {
      return (
        <p className="control boilerplate-feedback-dropdown">
          <span className="select">
            <select onChange={this.chooseSpecificBoilerplateFeedback} ref="boilerplate">
              <option>Select specific boilerplate feedback</option>
              {this.boilerplateSpecificFeedbackToOptions(selectedCategory)}
            </select>
          </span>
        </p>
      )
    } else {
      return (<span />)
    }
  },

  renderNewResponseForm: function () {
    return (
      <div className="box">
        <h6 className="control subtitle">Add a new response</h6>
        <label className="label">Response text</label>
        <p className="control">
          <input className="input" type="text" ref="newResponseText"></input>
        </p>
        <label className="label">Feedback</label>
        <p className="control">
          <input className="input" type="text" ref="newResponseFeedback"></input>
        </p>
        <label className="label">Boilerplate feedback</label>
        <div className="boilerplate-feedback-dropdown-container">
          {this.renderBoilerplateCategoryDropdown()}
          {this.renderBoilerplateCategoryOptionsDropdown()}
        </div>
        <p className="control">
          <label className="checkbox">
            <input ref="newResponseOptimal" type="checkbox" />
            Optimal?
          </label>
        </p>
        <button className="button is-primary" onClick={this.submitNewResponse}>Add Response</button>
      </div>
    )
  },

  renderEditForm: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    const question = (data[questionID])
    if (this.props.questions.states[questionID] === C.EDITING_QUESTION) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <EditFrom question={question} submit={this.saveQuestionEdits} itemLevels={this.props.itemLevels} concepts={this.props.concepts}/>
        </Modal>
      )
    }
  },

  render: function (){
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      var responses = hashToCollection(data[questionID].responses)
      return (
        <div>
          {this.renderEditForm()}
          <Link to={'admin/questions'}> Return to All Questions </Link>
          <h4 className="title" dangerouslySetInnerHTML={{__html: data[questionID].prompt}}></h4>
          <h6 className="subtitle">{responses.length} Responses</h6>
          <Link to={'play/questions/' + questionID} className="button is-outlined is-primary">Play Question</Link><br/><br/>
          <Chart data={_.values(this.formatForPieChart())}/>
          <p className="control button-group">
            <button className="button is-info" onClick={this.startEditingQuestion}>Edit Question</button>
            <Link to={'admin/questions'} className="button is-danger" onClick={this.deleteQuestion}>Delete Question</Link>
          </p>
          {this.renderNewResponseForm()}
          <ResponseComponent
            question={data[questionID]}
            questionID={questionID}
            states={states}
            dispatch={this.props.dispatch}
            admin={true}/>
        </div>
      )
    } else if (this.props.questions.hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <p>404: No Question Found</p>
      )
    }

  }
})

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(Question)
