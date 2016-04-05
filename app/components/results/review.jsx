import React from 'react'
import { connect } from 'react-redux'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Response from '../questions/response.jsx'
import C from '../../constants'
import SharedSection from '../shared/section.jsx'

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
      ascending: false
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


  renderResponses: function () {
    const {data, states} = this.props.questions, {questionID} = this.props.params;
    var responses = hashToCollection(data[questionID].responses)
    var responsesListItems = _.sortBy(responses, (resp) =>
        {return resp[this.state.sorting] || 0 }
      ).map((resp) => {
      return (
        <div className="column is-half">
          <Response
          response={resp}
          getResponse={this.getResponse}
          states={states}
          questionID={questionID}
          dispatch={this.props.dispatch}
          key={resp.key}
          readOnly={true} />
        </div>
      )
    })
    if (this.state.ascending) {
      return responsesListItems;
    } else {
      return responsesListItems.reverse();
    }
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
      </ul>
    );
  },

  render: function (){
    const {data} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      var responses = hashToCollection(data[questionID].responses)
      return (
        <SharedSection>
          <h4 className="title">{data[questionID].prompt}</h4>
          <h6 className="subtitle">{responses.length} Responses</h6>
          <div className="tabs is-toggle is-fullwidth">
            {this.renderSortingFields()}
          </div>
          <div className="columns is-multiline">
            {this.renderResponses()}
          </div>
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
