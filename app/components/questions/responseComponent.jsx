import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/responses'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import ResponseList from './responseList.jsx'
import Question from '../../libs/question'
import questionActions from '../../actions/questions'
import ResponseSortFields from './responseSortFields.jsx'
import ResponseToggleFields from './responseToggleFields.jsx'


const labels = ["Optimal", "Sub-Optimal", "Common Error", "Unmatched"]
const colors = ["#F5FAEF", "#FFF9E8", "#FFF0F2", "#F6ECF8"]
const feedbackStrings = {
  punctuationError: "punctuation error",
  typingError: "spelling mistake",
  caseError: "capitalization error"
}

const Responses = React.createClass({
  expand: function (responseKey) {
    this.props.dispatch(actions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse: function (rid, vals) {
    this.props.dispatch(questionActions.submitResponseEdit(this.props.questionID, rid, vals))
  },

  getMatchingResponse: function (rid) {
    var fields = {
      responses: _.filter(this.responsesWithStatus(), (resp) => {
        return resp.statusCode < 2
      })
    }
    var question = new Question(fields);
    return question.checkMatch(this.getResponse(rid).text);
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError')
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return "You have made a " + feedbackStrings[key] + "."
      }
    }))
    return errorComponents[0]
  },

  rematchResponse: function (rid) {
    var newResponse = this.getMatchingResponse(rid)
    var response = this.getResponse(rid)
    if (!newResponse.found) {
      var newValues = {
        text: response.text,
        count: response.count
      }
      this.props.dispatch(
        questionActions.setUpdatedResponse(this.props.questionID, rid, newValues)
      )
      return
    }
    if (newResponse.response.key === response.parentID) {
      return
    }
    else {
      var newErrorResp = {
        parentID: newResponse.response.key,
        feedback: this.generateFeedbackString(newResponse)
      }
      this.updateRematchedResponse(rid, newErrorResp)
    }
    // this.updateReponseResource(response)
    // this.submitResponse(response)
    // this.setState({editing: false})
  },

  rematchAllResponses: function () {
    const weak = _.filter(this.responsesWithStatus(), (resp) => {
      return resp.statusCode > 1
    })
    weak.forEach((resp) => {
      this.rematchResponse(resp.key)
    })
  },

  responsesWithStatus: function () {
    var responses = hashToCollection(this.props.question.responses)
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

  gatherVisibleResponses: function () {
    var responses = this.responsesWithStatus();
    return _.filter(responses, (response) => {
      return this.props.responses.visibleStatuses[labels[response.statusCode]]
    });
  },

  getResponse: function (responseID) {
    var responses = hashToCollection(this.props.question.responses)
    return _.find(responses, {key: responseID})
  },

  getChildResponses: function (responseID) {
    var responses = hashToCollection(this.props.question.responses)
    return _.where(responses, {parentID: responseID})
  },

  renderResponses: function () {
    const {questionID} = this.props;
    var responses = this.gatherVisibleResponses();
    var responsesListItems = _.sortBy(responses, (resp) =>
        {return resp[this.props.responses.sorting] || 0 }
      )
    return <ResponseList
      responses={responsesListItems}
      getResponse={this.getResponse}
      getChildResponses={this.getChildResponses}
      states={this.props.states}
      questionID={questionID}
      dispatch={this.props.dispatch}
      admin={this.props.admin}
      expanded={this.props.responses.expanded}
      expand={this.expand}
      ascending={this.props.responses.ascending}
      getMatchingResponse={this.getMatchingResponse}/>
  },

  toggleResponseSort: function (field) {
    this.props.dispatch(actions.toggleResponseSort(field));
  },

  renderSortingFields: function () {
    return <ResponseSortFields
      sorting={this.props.responses.sorting}
      ascending={this.props.responses.ascending}
      toggleResponseSort={this.toggleResponseSort}/>
  },

  toggleField: function (status) {
    this.props.dispatch(actions.toggleStatusField(status))
  },

  renderStatusToggleMenu: function () {
    return (
      <ResponseToggleFields
        labels={labels}
        toggleField={this.toggleField}
        visibleStatuses={this.props.responses.visibleStatuses} />
    )
  },

  collapseAllResponses: function () {
    this.props.dispatch(actions.collapseAllResponses());
  },

  expandAllResponses: function () {
    const responses = this.responsesWithStatus();
    var newExpandedState = this.props.responses.expanded;
    for (var i = 0; i < responses.length; i++) {
      newExpandedState[responses[i].key] = true;
    };
    this.props.dispatch(actions.expandAllResponses(newExpandedState));
  },

  allClosed: function () {
    var expanded = this.props.responses.expanded;
    for (var i in expanded) {
        if (expanded[i] === true) return false;
    }
    return true;
  },

  renderExpandCollapseAll: function () {
    var text, handleClick;

    if (this.allClosed()) {
      handleClick = this.expandAllResponses;
      text = "Expand All";
    } else {
      handleClick = this.collapseAllResponses;
      text = "Close All";
    }
    return <a className="button is-fullwidth" onClick={handleClick}> {text} </a>
  },

  render: function () {
    return (
      <div>
        <div className="tabs is-toggle is-fullwidth">
          {this.renderSortingFields()}
        </div>
        <div className="tabs is-toggle is-fullwidth">
          {this.renderStatusToggleMenu()}
        </div>
        <div className="columns">
          <div className="column">
            {this.renderExpandCollapseAll()}
          </div>
          <div className="column">
            <button className="button is-fullwidth is-outlined" onClick={this.rematchAllResponses}> Rematch All </button>
          </div>
        </div>

        {this.renderResponses()}
      </div>
    )
  }
})

function select(state) {
  return {
    responses: state.responses
  }
}

export default connect(select)(Responses);
