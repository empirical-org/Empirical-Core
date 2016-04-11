import React from 'react'
import { connect } from 'react-redux'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Response from '../questions/response.jsx'
import C from '../../constants'
import SharedSection from '../shared/section.jsx'
import Chart from '../questions/pieChart.jsx'
import ResponseList from '../questions/responseList.jsx'
const labels = ["Optimal", "Sub-Optimal", "Common Error", "Unmatched"]
const colors = ["#F5FAEF", "#FFF9E8", "#FFF0F2", "#F6ECF8"]

const Review = React.createClass({

  // renderQuestions: function () {
  //   const {data} = this.props.concepts;
  //   const keys = _.keys(data);
  //   return keys.map((key) => {
  //     console.log(key, data, data[key])
  //     return (<li><Link to={'/admin/concepts/' + key}>{data[key].name}</Link></li>)
  //   })
  // },

  getInitialState: function () {
    return {
      sorting: "count",
      ascending: false,
      visibleStatuses: {
        "Optimal": true,
        "Sub-Optimal": true,
        "Common Error": true,
        "Unmatched": true
      },
      expanded: {}
    }
  },

  expand: function (responseKey) {
    var newState = this.state.expanded;
    newState[responseKey] = !newState[responseKey];
    this.setState({expanded: newState})
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

  toggleResponseSort: function (field) {
    (field === this.state.sorting ? this.setState({ascending: !this.state.ascending}) : this.setState({sorting: field, ascending: false}));
  },

  responsesWithStatus: function () {
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    var responses = hashToCollection(data[questionID].responses)
    return responses.map((response) => {
      var statusCode;
      if (!response.feedback) {
        statusCode = 3;
      } else if (!!response.parentID) {
        statusCode = 2;
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
      console.log("val: ", val)
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

  gatherVisibleResponses: function () {
    var responses = this.responsesWithStatus();
    return _.filter(responses, (response) => {
      return this.state.visibleStatuses[labels[response.statusCode]]
    });
  },


  renderResponses: function () {
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    var responses = this.gatherVisibleResponses()
    var responsesListItems = _.sortBy(responses, (resp) =>
        {return resp[this.state.sorting] || 0 }
      )
    return <ResponseList
      responses={responsesListItems}
      getResponse={this.getResponse}
      states={states}
      questionID={questionID}
      dispatch={this.props.dispatch}
      admin={false}
      expanded={this.state.expanded}
      expand={this.expand}/>
  },

  renderArrow: function () {
    return (
      <p style="display: inline;">
        {this.state.ascending ? "&uarr;" : "&darr;"}
      </p>
    )
  },

  formatSortField: function (displayName, stateName) {
    if (this.state.sorting === stateName) {
      return (
        <li className="is-active">
          <a onClick={this.toggleResponseSort.bind(null, stateName)}>
            {displayName} {this.state.ascending ? "^" : "v"}
            </a>

        </li>
      )
    } else {
      return (
        <li>
          <a onClick={this.toggleResponseSort.bind(null, stateName)}>{displayName}</a>
        </li>
      );
    }
  },

  renderSortingFields: function () {
    return (
      <ul>
        {this.formatSortField('Submissions', 'count')}
        {this.formatSortField('Text', 'text')}
        {this.formatSortField('Created At', 'createdAt')}
        {this.formatSortField('Status', 'statusCode')}
      </ul>
    );
  },

  toggleField: function (status) {
    var toggledStatus = {};
    var newVisibleStatuses = {};
    toggledStatus[status] = !this.state.visibleStatuses[status];
    _.extend(newVisibleStatuses, this.state.visibleStatuses, toggledStatus);
    this.setState({visibleStatuses: newVisibleStatuses});
  },


  formatToggleField: function (status) {
    var checkBox;
    if (this.state.visibleStatuses[status]) {
      checkBox = (<input onChange={this.toggleField.bind(null, status)} type="checkbox" checked={true} />)
    } else {
      checkBox = (<input onChange={this.toggleField.bind(null, status)} type="checkbox" checked={false} />)
    }

    return (
      <li>
        <label className="panel-checkbox toggle">
          {checkBox}
          {status}
        </label>
      </li>
    )
  },

  renderStatusToggleMenu: function () {
    return (
      <ul>
        {this.formatToggleField(labels[0])}
        {this.formatToggleField(labels[1])}
        {this.formatToggleField(labels[2])}
        {this.formatToggleField(labels[3])}
      </ul>
    )
  },


  render: function (){
    const {data} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      var responses = hashToCollection(data[questionID].responses)
      return (
        <SharedSection>
          <h4 className="title">{data[questionID].prompt}</h4>
          <h6 className="subtitle">{responses.length} Responses</h6>
            <div className='columns'>
              <div className='column is-half'>
                <Chart data={_.values(this.formatForPieChart())}/>
              </div>
          </div>
          <div className="tabs is-toggle is-fullwidth">
            {this.renderSortingFields()}
          </div>
          <div className="tabs is-toggle is-fullwidth">
            {this.renderStatusToggleMenu()}
          </div>
          {this.renderResponses()}

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
