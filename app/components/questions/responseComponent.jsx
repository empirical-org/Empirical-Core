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
import FocusPointForm from './focusPointForm.jsx'


const labels = ["Human Optimal", "Human Sub-Optimal", "Algorithm Optimal", "Algorithm Sub-Optimal",  "Unmatched"]
const colors = ["#81c784", "#ffb74d", "#ba68c8", "#5171A5", "#e57373"]
const feedbackStrings = {
  punctuationError: "There may be an error. How could you update the punctuation?",
  typingError: "Try again. There may be a spelling mistake.",
  caseError: "Try again. There may be a capitalization error.",
  minLengthError: "Try again. Do you have all of the information from the prompt?",
  maxLengthError: "Try again. How could this sentence be shorter and more concise?"
}

const Responses = React.createClass({
  expand: function (responseKey) {
    this.props.dispatch(actions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse: function (rid, vals) {
    this.props.dispatch(questionActions.submitResponseEdit(this.props.questionID, rid, vals))
  },

  getFocusPoint: function () {
    return this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints)[0] : undefined
  },

  getPercentageWeakResponses: function() {
    var fields = {
      responses: this.responsesWithStatus(),
      focusPoints: this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints) : []
    }
    var question = new Question(fields);
    return question.getPercentageWeakResponses()
  },

  getMatchingResponse: function (rid) {
    var fields = {
      responses: _.filter(this.responsesWithStatus(), (resp) => {
        return resp.statusCode < 2
      }),
      focusPoints: this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints) : []
    }
    var question = new Question(fields);
    return question.checkMatch(this.getResponse(rid).text);
  },

  getErrorsForAttempt: function (attempt) {
    return attempt.feedback
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // // add keys for react list elements
    // var errorComponents = _.values(_.mapObject(errors, (val, key) => {
    //   if (val) {
    //     return feedbackStrings[key]
    //   }
    // }))
    return errors
  },

  rematchResponse: function (rid) {
    var newResponse = this.getMatchingResponse(rid)
    var response = this.getResponse(rid)
    if (!newResponse.found) {
      var newValues = {
        weak: false,
        text: response.text,
        count: response.count
      }
      this.props.dispatch(
        questionActions.setUpdatedResponse(this.props.questionID, rid, newValues)
      )
      return
    }
    if (newResponse.response.key === response.parentID) {
      if (newResponse.author) {
        var newErrorResp = {
          weak: false,
          author: newResponse.author,
          feedback: this.generateFeedbackString(newResponse)
        }
        this.updateRematchedResponse(rid, newErrorResp)
      }
    }
    else {
      var newErrorResp = {
        weak: false,
        parentID: newResponse.response.key,
        author: newResponse.author,
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
      getMatchingResponse={this.getMatchingResponse}
      showPathways={true}
      printPathways={this.mapCountToResponse}
      toPathways={this.mapCountToToResponse} />
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

  renderRematchAllButton: function () {
    if (this.props.admin) {
      return (
        <div className="column">
          <button className="button is-fullwidth is-outlined" onClick={this.rematchAllResponses}> Rematch All </button>
        </div>
      )
    }
  },

  getToPathwaysForResponse: function (rid) {
    var responseCollection = hashToCollection(this.props.pathways.data);
    var responsePathways = _.where(responseCollection, {fromResponseID: rid});
    return responsePathways;
  },

  getUniqAndCountedToResponsePathways: function (rid) {
    const counted = _.countBy(this.getToPathwaysForResponse(rid), (path)=>{
      return path.toResponseID;
    });
    return counted;
  },

  mapCountToToResponse: function (rid) {
    const mapped = _.mapObject(this.getUniqAndCountedToResponsePathways(rid), (value, key) => {
      var response = this.props.question.responses[key]
      // response.pathCount = value
      return response
    });
    return _.values(mapped)
  },

  // From pathways

  getFromPathwaysForResponse: function (rid) {
    var responseCollection = hashToCollection(this.props.pathways.data);
    var responsePathways = _.where(responseCollection, {toResponseID: rid});
    return responsePathways;
  },

  getUniqAndCountedResponsePathways: function (rid) {
    const counted = _.countBy(this.getFromPathwaysForResponse(rid), (path)=>{
      return path.fromResponseID;
    });
    return counted;
  },

  mapCountToResponse: function (rid) {
    const mapped = _.mapObject(this.getUniqAndCountedResponsePathways(rid), (value, key) => {
      var response = this.props.question.responses[key]
      if (response) {
        response.pathCount = value
      } else {
        response = {
          initial: true,
          pathCount: value,
          key: 'initial'
        }
      }
      return response
    });
    return _.values(mapped)
  },

  submitFocusPointForm: function(data){
      if (this.getFocusPoint()) {
        // update
      } else {
          this.props.dispatch(questionActions.submitNewFocusPoint(this.props.questionID, data));
      }
  },

  renderFocusPoint: function () {
    return <FocusPointForm getFocusPoint={this.getFocusPoint} submitFocusPoint={this.submitFocusPointForm}/>
  },

  render: function () {
    return (
      <div>
        {this.renderFocusPoint()}
        <div className="columns">
          <div className="column">
            Percentage of weak reponses: {this.getPercentageWeakResponses()}%
          </div>
        </div>
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
          {this.renderRematchAllButton()}
        </div>

        {this.renderResponses()}
      </div>
    )
  }
})


function select(state) {
  return {
    responses: state.responses,
    pathways: state.pathways
  }
}

export default connect(select)(Responses);
