import React from 'react';
import { connect } from 'react-redux';
import filterActions from '../../actions/filters';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import ResponseList from './responseList.jsx';
import QuestionMatcher from '../../libs/question';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import diagnosticQuestionActions from '../../actions/diagnosticQuestions';
import ResponseSortFields from './responseSortFields.jsx';
import ResponseToggleFields from './responseToggleFields.jsx';
import FocusPointForm from './focusPointForm.jsx';
import FocusPointSummary from './focusPointSummary.jsx';
import { getPartsOfSpeechTags } from '../../libs/partsOfSpeechTagging.js';
import POSForResponsesList from './POSForResponsesList.jsx';
import respWithStatus from '../../libs/responseTools.js';
import POSMatcher from '../../libs/sentenceFragment.js';
import DiagnosticQuestionMatcher from '../../libs/diagnosticQuestion.js';

import {
  deleteResponse
} from '../../actions/responses.js';
const C = require('../../constants').default;

const labels = C.ERROR_AUTHORS;
const qualityLabels = ['Human Optimal', 'Human Sub-Optimal', 'Algorithm Optimal', 'Algorithm Sub-Optimal', 'Unmatched'];
// ["Human Optimal", "Human Sub-Optimal", "Algorithm Optimal", "Algorithm Sub-Optimal",  "Unmatched",
                // "Focus Point Hint", "Word Error Hint", "Punctuation Hint", "Capitalization Hint", "Punctuation and Case Hint", "Whitespace Hint",
                // "Missing Word Hint", "Additional Word Hint", "Modified Word Hint", "Missing Details Hint", "Not Concise Hint", "No Hint"]
const colors = ['#81c784', '#ffb74d', '#BA68C8', '#5171A5', '#e57373'];

const responsesPerPage = 20;
const feedbackStrings = C.FEEDBACK_STRINGS;

const Responses = React.createClass({
  getInitialState() {
    let actions;
    let matcher;
    if (this.props.mode === 'sentenceFragment') {
      actions = sentenceFragmentActions;
      matcher = POSMatcher;
    } else if (this.props.mode === 'diagnosticQuestion') {
      actions = diagnosticQuestionActions;
      matcher = DiagnosticQuestionMatcher;
    } else {
      actions = questionActions;
      matcher = QuestionMatcher;
    }
    return {
      actions,
      viewingResponses: true,
      responsePageNumber: 1,
      matcher,
    };
  },

  expand(responseKey) {
    this.props.dispatch(filterActions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse(rid, vals) {
    this.props.dispatch(this.state.actions.submitResponseEdit(this.props.questionID, rid, vals));
  },

  getFocusPoint() {
    return this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints)[0] : undefined;
  },

  getPercentageWeakResponses() {
    const fields = {
      responses: this.responsesWithStatus(),
      focusPoints: this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints) : [],
    };
    const question = new this.state.matcher(fields);
    return question.getPercentageWeakResponses();
  },

  // Ryan Look here!!!
  getMatchingResponse(rid) {
    const item = this.props.question;
    // Pass all possible fields regardless of matcher as the matchers will filter it out.
    const fields = {
      wordCountChange: item.wordCountChange,
      questionUID: this.props.questionID,
      sentences: item.sentences,
      prompt: item.prompt,
      responses: _.filter(this.responsesWithStatus(), resp => resp.statusCode < 2),
      focusPoints: item.focusPoints ? hashToCollection(item.focusPoints) : [],
    };
    const markingObject = new this.state.matcher(fields); // This should take account of mode.
    return markingObject.checkMatch(this.getResponse(rid).text);
  },

  getErrorsForAttempt(attempt) {
    return attempt.feedback;
  },

  generateFeedbackString(attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // // add keys for react list elements
    // var errorComponents = _.values(_.mapObject(errors, (val, key) => {
    //   if (val) {
    //     return feedbackStrings[key]
    //   }
    // }))
    return errors;
  },

  rematchResponse(rid) {
    const newMatchedResponse = this.getMatchingResponse(rid);
    const response = this.getResponse(rid);
    const changed = newMatchedResponse.response.parentID !== response.parentID;
    console.log('Rematched: t, o, n: ', changed, response, newMatchedResponse);
    // if (!newMatchedResponse.found) {
    //   console.log('Rematching not found: ', newMatchedResponse);
    //
    //   const newValues = {
    //     weak: false,
    //     text: response.text,
    //     count: response.count,
    //   };
    //   this.props.dispatch(
    //     this.state.actions.setUpdatedResponse(this.props.questionID, rid, newValues)
    //   );
    //   return;
    // }
    // if (newMatchedResponse.response.text === response.text) {
    //   console.log('Rematching duplicate', newMatchedResponse);
    //   this.props.dispatch(deleteResponse(this.props.questionID, rid));
    // } else if (newMatchedResponse.response.key === response.parentID) {
    //   console.log('Rematching same parent: ', newMatchedResponse);
    //   if (newMatchedResponse.author) {
    //     var newErrorResp = {
    //       weak: false,
    //       author: newMatchedResponse.author,
    //       feedback: this.generateFeedbackString(newMatchedResponse),
    //     };
    //     this.updateRematchedResponse(rid, newErrorResp);
    //   }
    // } else {
    //   console.log('Rematching new error', newMatchedResponse);
    //   var newErrorResp = {
    //     weak: false,
    //     parentID: newMatchedResponse.response.key,
    //     author: newMatchedResponse.author,
    //     feedback: this.generateFeedbackString(newMatchedResponse),
    //   };
    //   this.updateRematchedResponse(rid, newErrorResp);
    // }

    // this.updateReponseResource(response)
    // this.submitResponse(response)
    // this.setState({editing: false})
  },

  rematchAllResponses() {
    console.log('Rematching All Responses');
    const weak = _.filter(this.responsesWithStatus(), resp => resp.statusCode > 1);
    weak.forEach((resp) => {
      console.log('Rematching: ', resp.key);
      this.rematchResponse(resp.key);
    });
    console.log('Finished Rematching All Responses');
  },

  responsesWithStatus() {
    return hashToCollection(respWithStatus(this.props.responses));
  },

  responsesGroupedByStatus() {
    return _.groupBy(this.responsesWithStatus(), 'statusCode');
  },

  gatherVisibleResponses() {
    const responses = this.responsesWithStatus();
    const filtered = _.filter(responses, response => (
        this.props.filters.visibleStatuses[qualityLabels[response.statusCode]] &&
        (
          this.props.filters.visibleStatuses[response.author] ||
          (response.author === undefined && this.props.filters.visibleStatuses['No Hint'])
        )
      ));
    const sorted = _.sortBy(filtered, resp =>
        resp[this.props.filters.sorting] || 0
    );
    if (this.props.filters.ascending) {
      return sorted;
    } else {
      return sorted.reverse();
    }
  },

  getResponse(responseID) {
    return this.props.responses[responseID];
  },

  getChildResponses(responseID) {
    const responses = hashToCollection(this.props.responses);
    return _.where(responses, { parentID: responseID, });
  },

  getResponsesForCurrentPage(responses) {
    const bounds = this.getBoundsForCurrentPage(responses);
    // go until responses.length because .slice ends at endIndex-1
    return responses.slice(bounds[0], bounds[1]);
  },

  getBoundsForCurrentPage(responses) {
    const startIndex = (this.state.responsePageNumber - 1) * responsesPerPage;
    const endIndex = startIndex + responsesPerPage > responses.length ? responses.length : startIndex + responsesPerPage;
    return [startIndex, endIndex];
  },

  renderResponses() {
    if (this.state.viewingResponses) {
      const { questionID, } = this.props;
      const responses = this.gatherVisibleResponses();
      const responsesListItems = this.getResponsesForCurrentPage(responses);
      return (<ResponseList
        responses={responsesListItems}
        getResponse={this.getResponse}
        getChildResponses={this.getChildResponses}
        states={this.props.states}
        questionID={questionID}
        dispatch={this.props.dispatch}
        admin={this.props.admin}
        expanded={this.props.filters.expanded}
        expand={this.expand}
        ascending={this.props.filters.ascending}
        getMatchingResponse={this.rematchResponse}
        showPathways
        printPathways={this.mapCountToResponse}
        toPathways={this.mapCountToToResponse}
        conceptsFeedback={this.props.conceptsFeedback}
        mode={this.props.mode}
        concepts={this.props.concepts}
        conceptID={this.props.question.conceptID}
      />);
    }
  },

  toggleResponseSort(field) {
    this.props.dispatch(filterActions.toggleResponseSort(field));
  },

  renderSortingFields() {
    return (<ResponseSortFields
      sorting={this.props.filters.sorting}
      ascending={this.props.filters.ascending}
      toggleResponseSort={this.toggleResponseSort}
    />);
  },

  toggleField(status) {
    this.props.dispatch(filterActions.toggleStatusField(status));
  },

  resetFields() {
    this.props.dispatch(filterActions.resetAllFields());
  },

  renderStatusToggleMenu() {
    return (
      <ResponseToggleFields
        labels={labels}
        qualityLabels={qualityLabels}
        toggleField={this.toggleField}
        visibleStatuses={this.props.filters.visibleStatuses}
        resetPageNumber={this.resetPageNumber}
        resetFields={this.resetFields}
      />
    );
  },

  collapseAllResponses() {
    this.props.dispatch(filterActions.collapseAllResponses());
  },

  expandAllResponses() {
    const responses = this.responsesWithStatus();
    const newExpandedState = this.props.filters.expanded;
    for (let i = 0; i < responses.length; i++) {
      newExpandedState[responses[i].key] = true;
    }
    this.props.dispatch(filterActions.expandAllResponses(newExpandedState));
  },

  allClosed() {
    const expanded = this.props.filters.expanded;
    for (const i in expanded) {
      if (expanded[i] === true) return false;
    }
    return true;
  },

  renderExpandCollapseAll() {
    let text,
      handleClick;

    if (this.allClosed()) {
      handleClick = this.expandAllResponses;
      text = 'Expand All';
    } else {
      handleClick = this.collapseAllResponses;
      text = 'Close All';
    }
    return <a className="button is-fullwidth" onClick={handleClick}> {text} </a>;
  },

  renderRematchAllButton() {
    if (this.props.admin) {
      return (
        <div className="column">
          <button className="button is-fullwidth is-outlined" onClick={this.rematchAllResponses}> Rematch All </button>
        </div>
      );
    }
  },

  renderPOSStrings() {
    if (!this.state.viewingResponses) {
      const posTagsList = this.getResponsesForCurrentPage(hashToCollection(this.getPOSTagsList()));
      return (
        <div>
          <POSForResponsesList posTagsList={posTagsList} />
        </div>
      );
    }
  },

  renderViewPOSButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={() => { this.setState({ viewingResponses: false, responsePageNumber: 1, }); }}> View Parts of Speech </button>
      </div>
    );
  },

  renderViewResponsesButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={() => { this.setState({ viewingResponses: true, responsePageNumber: 1, }); }}> View Unique Responses </button>
      </div>
    );
  },

  renderResetAllFiltersButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.resetFields}>Reset All Filters</button>
      </div>
    );
  },

  getToPathwaysForResponse(rid) {
    const responseCollection = hashToCollection(this.props.pathways.data);
    const responsePathways = _.where(responseCollection, { fromResponseID: rid, });
    return responsePathways;
  },

  getUniqAndCountedToResponsePathways(rid) {
    const counted = _.countBy(this.getToPathwaysForResponse(rid), path => path.toResponseID);
    return counted;
  },

  mapCountToToResponse(rid) {
    const mapped = _.mapObject(this.getUniqAndCountedToResponsePathways(rid), (value, key) => {
      const response = this.props.responses[key];
      // response.pathCount = value
      return response;
    });
    return _.values(mapped);
  },

  // From pathways

  getFromPathwaysForResponse(rid) {
    const responseCollection = hashToCollection(this.props.pathways.data);
    const responsePathways = _.where(responseCollection, { toResponseID: rid, });
    return responsePathways;
  },

  getUniqAndCountedResponsePathways(rid) {
    const counted = _.countBy(this.getFromPathwaysForResponse(rid), path => path.fromResponseID);
    return counted;
  },

  getPOSTagsList() {
    const responses = this.gatherVisibleResponses();

    const responsesWithPOSTags = responses.map((response) => {
      response.posTags = getPartsOfSpeechTags(response.text.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')); // some text has html tags
      return response;
    });

    let posTagsList = {},
      posTagsAsString = '';
    responses.forEach((response) => {
      posTagsAsString = response.posTags.join();
      if (posTagsList[posTagsAsString]) {
        posTagsList[posTagsAsString].count += response.count;
        posTagsList[posTagsAsString].responses.push(response);
      } else {
        posTagsList[posTagsAsString] = {
          tags: response.posTags,
          count: response.count,
          responses: [
            response
          ],
        };
      }
    });
    return posTagsList;
  },

  mapCountToResponse(rid) {
    const mapped = _.mapObject(this.getUniqAndCountedResponsePathways(rid), (value, key) => {
      let response = this.props.responses[key];
      if (response) {
        response.pathCount = value;
      } else {
        response = {
          initial: true,
          pathCount: value,
          key: 'initial',
        };
      }
      return response;
    });
    return _.values(mapped);
  },

  incrementPageNumber() {
    if (this.state.responsePageNumber < this.getNumberOfPages()) {
      this.setState({
        responsePageNumber: this.state.responsePageNumber + 1,
      });
    }
  },

  decrementPageNumber() {
    if (this.state.responsePageNumber !== 1) {
      this.setState({
        responsePageNumber: this.state.responsePageNumber - 1,
      });
    }
  },

  getNumberOfPages() {
    let array;
    if (this.state.viewingResponses) {
      array = this.gatherVisibleResponses();
    } else {
      array = hashToCollection(this.getPOSTagsList());
    }
    return Math.ceil(array.length / responsesPerPage);
  },

  submitFocusPointForm(data) {
    if (this.getFocusPoint()) {
      this.props.dispatch(this.state.actions.submitEditedFocusPoint(this.props.questionID, data, this.getFocusPoint().key));
    } else {
      this.props.dispatch(this.state.actions.submitNewFocusPoint(this.props.questionID, data));
    }
  },

  renderFocusPoint() {
    // fp is a required prop for FocusPointForm, however, if a question doesn't have
    // an fp, it evaluates to undefined, triggering an error on a required proptype.
    const fp = this.getFocusPoint() ? this.getFocusPoint() : false;
    return (
      <FocusPointSummary fp={fp}>
        <FocusPointForm fp={fp} submitFocusPoint={this.submitFocusPointForm} />
      </FocusPointSummary>
    );
  },

  resetPageNumber() {
    this.setState({
      responsePageNumber: 1,
    });
  },

  renderDisplayingMessage() {
    let array,
      endWord;
    if (this.state.viewingResponses) {
      array = this.gatherVisibleResponses();
      endWord = ' responses';
    } else {
      array = hashToCollection(this.getPOSTagsList());
      endWord = ' parts of speech strings';
    }
    const bounds = this.getBoundsForCurrentPage(array);
    const message = `Displaying ${bounds[0] + 1}-${bounds[1]} of ${array.length}${endWord}`;
    return <p className="label">{message}</p>;
  },

  renderPageNumbers() {
    // var array
    // if(this.state.viewingResponses) {
    //   array = this.gatherVisibleResponses()
    // } else {
    //   array = this.getPOSTagsList()
    // }

    const responses = this.gatherVisibleResponses();
    const responsesPerPage = 20;
    const numPages = Math.ceil(responses.length / responsesPerPage);
    const pageNumbers = _.range(1, numPages + 1);

    let pageNumberStyle = {};
    const numbersToRender = pageNumbers.map((pageNumber) => {
      if (this.state.responsePageNumber === pageNumber) {
        pageNumberStyle = {
          backgroundColor: 'lightblue',
        };
      } else {
        pageNumberStyle = {};
      }
      return (
        <li>
          <a className="button" style={pageNumberStyle} onClick={() => { this.setState({ responsePageNumber: pageNumber, }); }}>{pageNumber}</a>
        </li>
      );
    });

    let nextButtonClassName = 'button pagination-extreme-button';
    if (this.state.responsePageNumber === this.getNumberOfPages()) {
      nextButtonClassName += ' is-disabled';
    }
    const nextButton = <a className={nextButtonClassName} onClick={this.incrementPageNumber}>Next</a>;

    let prevButtonClassName = 'button pagination-extreme-button';
    if (this.state.responsePageNumber === 1) {
      prevButtonClassName += ' is-disabled';
    }
    const prevButton = <a className={prevButtonClassName} onClick={this.decrementPageNumber}>Prev</a>;

    return (
      <div>
        <div className="response-pagination-container">
          <nav className="pagination response-pagination">
            {prevButton}
            {nextButton}
            <ul>
              {numbersToRender}
            </ul>
          </nav>
        </div>
      </div>
    );
  },

  render() {
    // console.log("Inside response component, props: ", this.props)
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
          {this.renderResetAllFiltersButton()}
          {this.renderViewResponsesButton()}
          {this.renderViewPOSButton()}
        </div>

        {this.renderDisplayingMessage()}
        {this.renderPageNumbers()}
        {this.renderResponses()}
        {this.renderPOSStrings()}
        {this.renderPageNumbers()}
      </div>
    );
  },
});

function select(state) {
  return {
    filters: state.filters,
    pathways: state.pathways,
    conceptsFeedback: state.conceptsFeedback,
    concepts: state.concepts,
  };
}

export default connect(select)(Responses);
