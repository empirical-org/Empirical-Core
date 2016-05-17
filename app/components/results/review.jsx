import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Response from '../questions/response.jsx'
import C from '../../constants'
import SharedSection from '../shared/section.jsx'
import Chart from '../questions/pieChart.jsx'
import ResponseComponent from '../questions/ResponseComponent.jsx'
const labels = ["Human Optimal", "Human Sub-Optimal", "Algorithm Optimal", "Algorithm Sub-Optimal",  "Unmatched"]
const colors = ["#81c784", "#ffb74d", "#ba68c8", "#5171A5", "#e57373"]

const Review = React.createClass({

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

  submitNewResponse: function () {
    var newResp = {
      vals: {
        text: this.refs.newResponseText.value,
        feedback: this.refs.newResponseFeedback.value,
        optimal: this.refs.newResponseOptimal.checked
      },
      questionID: this.props.params.questionID
    }
    this.props.dispatch(questionActions.submitNewResponse(newResp.questionID, newResp.vals))
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
        statusCode = (parentResponse.optimal ? 2 : 3);
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

  render: function (){
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      var responses = hashToCollection(data[questionID].responses)
      return (
        <SharedSection>
          <h4 className="title">{data[questionID].prompt}</h4>
          <h6 className="subtitle">{responses.length} Responses</h6>
          <Link to={'play/questions/' + questionID} className="button is-outlined is-primary">Play Question</Link><br/><br/>
          <div className='columns'>
            <div className='column is-half'>
              <Chart data={_.values(this.formatForPieChart())}/>
            </div>
          </div>

          <ResponseComponent
            question={data[questionID]}
            questionID={questionID}
            states={states}
            dispatch={this.props.dispatch}
            admin={false}/>
        </SharedSection>
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
    routing: state.routing
  }
}

export default connect(select)(Review)
