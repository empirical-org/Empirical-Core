import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/responses'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import ResponseList from './responseList.jsx'
import Question from '../../libs/question'
import questionActions from '../../actions/questions'
import sentenceFragmentActions from '../../actions/sentenceFragments'
import ResponseSortFields from './responseSortFields.jsx'
import ResponseToggleFields from './responseToggleFields.jsx'
import FocusPointForm from './focusPointForm.jsx'
import FocusPointSummary from './focusPointSummary.jsx'
import {getPartsOfSpeechTags} from '../../libs/partsOfSpeechTagging.js'
import POSForResponsesList from './POSForResponsesList.jsx'

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
  getInitialState: function () {
    let actions;
    if (this.props.mode === "sentenceFragment") {
      actions = sentenceFragmentActions;
    } else {
      actions = questionActions;
    }
    return {
      actions: actions,
      viewingResponses: true,
      responsePageNumber: 1
    }
  },

  expand: function (responseKey) {
    this.props.dispatch(actions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse: function (rid, vals) {
    this.props.dispatch(this.state.actions.submitResponseEdit(this.props.questionID, rid, vals))
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
        this.state.actions.setUpdatedResponse(this.props.questionID, rid, newValues)
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

  getResponsesForCurrentPage: function(responses) {
    const bounds = this.getBoundsForCurrentPage(responses)
    // go until responses.length because .slice ends at endIndex-1
    return responses.slice(bounds[0], bounds[1])
  },

  getBoundsForCurrentPage: function(responses) {
    const responsesPerPage = 10;
    const startIndex = (this.state.responsePageNumber-1)*responsesPerPage;
    const endIndex = startIndex+responsesPerPage > responses.length ? responses.length : startIndex+responsesPerPage
    return [startIndex, endIndex]
  },

  renderResponses: function () {
    if(this.state.viewingResponses) {
      const {questionID} = this.props;
      var responses = this.gatherVisibleResponses();
      responses = this.getResponsesForCurrentPage(responses);
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
        toPathways={this.mapCountToToResponse}
        conceptsFeedback={this.props.conceptsFeedback}
        mode={this.props.mode}
        concepts={this.props.concepts} />
    }
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

  renderPOSStrings: function() {
    if(!this.state.viewingResponses) {
      const responses = this.gatherVisibleResponses()

      const responsesWithPOSTags = responses.map((response) => {
        response.posTags = getPartsOfSpeechTags(response.text.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")) //some text has html tags
        return response
      })

      return (
        <div>
          <POSForResponsesList responses={responsesWithPOSTags} />
        </div>
      )
    }
  },

  renderViewPOSButton: function () {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={() => {this.setState({viewingResponses: false})}}> View Parts of Speech </button>
      </div>
    )
  },

  renderViewResponsesButton: function () {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={() => {this.setState({viewingResponses: true})}}> View Unique Responses </button>
      </div>
    )
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
        this.props.dispatch(this.state.actions.submitEditedFocusPoint(this.props.questionID, data, this.getFocusPoint().key))
      } else {
          this.props.dispatch(this.state.actions.submitNewFocusPoint(this.props.questionID, data));
      }
  },

  renderFocusPoint: function () {
    // fp is a required prop for FocusPointForm, however, if a question doesn't have
    // an fp, it evaluates to undefined, triggering an error on a required proptype.
    let fp = this.getFocusPoint() ? this.getFocusPoint() : false;
    return (
        <FocusPointSummary fp={fp}>
          <FocusPointForm fp={fp} submitFocusPoint={this.submitFocusPointForm}/>
        </FocusPointSummary>
    )
  },

  renderPageNumbers: function() {
    if(!this.state.viewingResponses) {
      return
    }
    
    const responses = this.gatherVisibleResponses()
    const responsesPerPage = 10;
    const numPages = Math.ceil(responses.length/responsesPerPage)
    const pageNumbers = _.range(1, numPages+1)

    const numbersToRender = pageNumbers.map((pageNumber) => {
      return (
        <a className="response-component-page-number" onClick={() => {this.setState({responsePageNumber: pageNumber})}}>{pageNumber + "\t"}</a>
      )
    })
    const bounds = this.getBoundsForCurrentPage(responses)
    const message = "Displaying " + (bounds[0]+1) + "-" + (bounds[1]) + " of " + (responses.length) + " responses."

    return (
      <div>
        {"Responses page number:\t\t"}
        {numbersToRender}
        <br/>
        {message}
      </div>
    )
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
          {this.renderViewResponsesButton()}
          {this.renderViewPOSButton()}
        </div>

        <div>
          {this.renderPageNumbers()}
        </div>
        <br />

        {this.renderResponses()}
        {this.renderPOSStrings()}
      </div>
    )
  }
})


function select(state) {
  return {
    responses: state.responses,
    pathways: state.pathways,
    conceptsFeedback: state.conceptsFeedback,
    concepts: state.concepts
  }
}

export default connect(select)(Responses);
