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
import { getPartsOfSpeechTags } from '../../libs/partsOfSpeechTagging.js';
import POSForResponsesList from './POSForResponsesList.jsx';
import respWithStatus from '../../libs/responseTools.js';
import POSMatcher from '../../libs/sentenceFragment.js';
import DiagnosticQuestionMatcher from '../../libs/diagnosticQuestion.js';
import massEdit from '../../actions/massEdit';
import TextEditor from './textEditor.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import QuestionBar from './questionBar.jsx';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  removeLinkToParentID,
  setUpdatedResponse
} from '../../actions/responses';

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
      percentageOfWeakResponses: 0,
      actions,
      viewingResponses: true,
      matcher,
      selectedResponses: [],
    };
  },

  componentDidMount() {
    this.searchResponses();
    this.props.dispatch(questionActions.initializeSubscription(this.props.questionID));
  },

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters.formattedFilterData, prevProps.filters.formattedFilterData)) {
      this.searchResponses();
    } else if (this.props.states[this.props.questionID] === C.SHOULD_RELOAD_RESPONSES && prevProps.states[prevProps.questionID] !== C.SHOULD_RELOAD_RESPONSES) {
      this.props.dispatch(questionActions.clearQuestionState(this.props.questionID));
      this.searchResponses();
    }
  },

  componentWillUnmount() {
    this.props.dispatch(questionActions.removeSubscription(this.props.questionID));
    this.clearResponses();
  },

  clearResponses() {
    this.props.dispatch(questionActions.updateResponses({ responses: [], numberOfResponses: 0, numberOfPages: 1, responsePageNumber: 1, }));
  },

  searchResponses() {
    this.props.dispatch(questionActions.searchResponses(this.props.questionID));
  },

  getTotalAttempts() {
    return _.reduce(this.props.responses, (memo, item) => memo + item.count, 0);
  },

  getResponseCount() {
    return this.props.filters.numberOfResponses;
  },

  removeResponseFromMassEditArray(responseKey) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  },

  expand(responseKey) {
    this.props.dispatch(filterActions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse(rid, vals) {
    this.props.dispatch(submitResponseEdit(rid, vals, this.props.questionID));
  },

  getPercentageWeakResponses() {
    // const item = this.props.question;
    // // pass all possible fields regardless of matcher as the matchers will filter it out.
    // const fields = {
    //   wordCountChange: item.wordCountChange,
    //   questionUID: this.props.questionID,
    //   sentences: item.sentences,
    //   prompt: item.prompt,
    //   focusPoints: item.focusPoints ? hashToCollection(item.focusPoints) : [],
    //   // ignoreCaseAndPunc: item.ignoreCaseAndPunc,
    // };
    // const markingObject = new this.state.matcher(fields);

    // const fields = {
    //   responses: this.responsesWithStatus(),
    //   focusPoints: this.props.question.focusPoints ? hashToCollection(this.props.question.focusPoints) : [],
    // };
    // const question = new this.state.matcher(fields);
    // return question.getPercentageWeakResponses();
    return this.state.percentageOfWeakResponses;
  },

  // ryan Look here!!!
  getMatchingResponse(rid) {
    const item = this.props.question;
    // pass all possible fields regardless of matcher as the matchers will filter it out.
    const fields = {
      wordCountChange: item.wordCountChange,
      questionUID: this.props.questionID,
      sentences: item.sentences,
      prompt: item.prompt,
      responses: _.filter(this.responsesWithStatus(), resp => resp.statusCode < 2),
      focusPoints: item.focusPoints ? hashToCollection(item.focusPoints) : [],
      incorrectSequences: item.incorrectSequences ? hashToCollection(item.incorrectSequences) : [],
      ignoreCaseAndPunc: item.ignoreCaseAndPunc,
    };
    const markingObject = new this.state.matcher(fields);
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
    const changed =
      (newMatchedResponse.response.parentID !== response.parentID) ||
      (newMatchedResponse.response.author !== response.author) ||
      (newMatchedResponse.response.feedback !== response.feedback) ||
      (newMatchedResponse.response.conceptResults !== response.conceptResults);
    const unmatched = (newMatchedResponse.found === false);
    console.log('Rematched: t, u, o, n: ', changed, unmatched);
    if (changed) {
      if (unmatched) {
        const newValues = {
          weak: false,
          feedback: undefined,
          parentID: undefined,
          text: response.text,
          count: response.count,
          questionUID: response.questionUID,
          gradeIndex: `unmatched${response.questionUID}`,
        };
        this.props.dispatch(
            this.updateRematchedResponse(rid, newValues)
          );
      } else if (newMatchedResponse.response.parentID === undefined) {
        this.props.dispatch(
          deleteResponse(this.props.questionID, rid)
        );
      } else {
        const newValues = {
          weak: false,
          parentID: newMatchedResponse.response.parentID,
          author: newMatchedResponse.response.author,
          feedback: newMatchedResponse.response.feedback,
          gradeIndex: `nonhuman${response.questionUID}`,
        };
        if (newMatchedResponse.response.conceptResults) {
          newValues.conceptResults = newMatchedResponse.response.conceptResults;
        }
        this.updateRematchedResponse(rid, newValues);
      }
    }
  },

  rematchAllResponses() {
    console.log('Rematching All Responses');
    const weak = _.filter(this.responsesWithStatus(), resp => resp.statusCode > 1);
    weak.forEach((resp, index) => {
      const percentage = index / weak.length * 100;
      console.log('Rematching: ', resp.key, percentage, '% complete');
      this.rematchResponse(resp.key);
    });
    console.log('Finished Rematching All Responses');
  },

  responsesWithStatus() {
    return hashToCollection(respWithStatus(this.props.filters.responses));
  },

  responsesGroupedByStatus() {
    return _.groupBy(this.responsesWithStatus(), 'statusCode');
  },

  responsesByStatusCodeAndResponseCount() {
    return _.mapObject(this.responsesGroupedByStatus(), (val, key) => _.reduce(val, (memo, resp) => memo + (resp.count || 0), 0));
  },

  formatForQuestionBar() {
    const sortedResponses = this.responsesByStatusCodeAndResponseCount();
    const totalResponseCount = Object.values(sortedResponses).reduce((a, b) => a + b);
    if (totalResponseCount == 0) {
      return _.mapObject(sortedResponses, (val, key) => ({
        value: 1 / Object.keys(sortedResponses).length * 100,
        color: '#eeeeee',
      }));
    }
    return _.mapObject(sortedResponses, (val, key) => ({
      value: val / totalResponseCount * 100,
      color: colors[key],
    }));
  },

  gatherVisibleResponses() {
    return this.responsesWithStatus();
  },

  getResponse(responseID) {
    return this.props.responses[responseID];
  },

  getChildResponses(responseID) {
    const responses = hashToCollection(this.props.responses);
    return _.where(responses, { parentID: responseID, });
  },

  getResponsesForCurrentPage(responses) {
    return responses;
  },

  getBoundsForCurrentPage(length) {
    const startIndex = (this.props.filters.responsePageNumber - 1) * responsesPerPage;
    const endIndex = startIndex + responsesPerPage > length ? length : startIndex + responsesPerPage;
    return [startIndex, endIndex];
  },

  renderResponses() {
    if (this.state.viewingResponses) {
      const { questionID, } = this.props;
      const responsesWStatus = this.responsesWithStatus();
      const responses = _.sortBy(responsesWStatus, 'sortOrder');
      // const responsesListItems = this.getResponsesForCurrentPage(this.getFilteredResponses(responses));
      return (<ResponseList
        responses={responses}
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
        massEdit={this.props.massEdit}
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

  deselectFields() {
    this.props.dispatch(filterActions.deselectAllFields());
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
        deselectFields={this.deselectFields}
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
      text = 'Expand';
    } else {
      handleClick = this.collapseAllResponses;
      text = 'Close';
    }
    return <a className="button is-fullwidth" onClick={handleClick}>{text}</a>;
  },

  renderRematchAllButton() {
    if (this.props.admin) {
      return (<button className="button is-outlined is-danger" style={{ float: 'right', }} onClick={this.rematchAllResponses}>Rematch Responses</button>);
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

  renderViewResponsesOrPOSButton() {
    return (
      <div className="column">
        <button
          className="button is-fullwidth is-outlined" onClick={() => {
            this.setState({
              viewingResponses: !this.state.viewingResponses,
            }, this.updatePageNumber(1));
          }}
        >Show {this.state.viewingResponses ? 'POS' : 'Uniques'}</button>
      </div>
    );
  },

  renderResetAllFiltersButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.resetFields}>Select All Filters</button>
      </div>
    );
  },

  renderDeselectAllFiltersButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.deselectFields}>Deselect All Filters</button>
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

  // from pathways

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

  handleStringFiltering() {
    this.props.dispatch(questionActions.updateStringFilter(this.refs.stringFilter.value, this.props.questionID));
    // this.setState({ stringFilter: this.refs.stringFilter.value, responsePageNumber: 1, }, () => this.searchResponses());
  },

  getFilteredResponses(responses) {
    if (this.props.filters.stringFilter == '') {
      return responses;
    }
    const that = this;
    return _.filter(responses, response => response.text.indexOf(that.props.filters.stringFilter) >= 0);
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

  updatePageNumber(pageNumber) {
    this.props.dispatch(questionActions.updatePageNumber(pageNumber, this.props.questionID));
  },

  incrementPageNumber() {
    if (this.props.filters.responsePageNumber < this.getNumberOfPages()) {
      this.updatePageNumber(this.props.filters.responsePageNumber + 1);
    }
  },

  decrementPageNumber() {
    if (this.props.filters.responsePageNumber !== 1) {
      this.updatePageNumber(this.props.filters.responsePageNumber - 1);
    }
  },

  getNumberOfPages() {
    return this.props.filters.numberOfPages;
  },

  resetPageNumber() {
    this.updatePageNumber(1);
  },

  renderDisplayingMessage() {
    let endWord,
      length;
    if (this.state.viewingResponses) {
      length = this.props.filters.numberOfResponses;
      endWord = ' responses';
    } else {
      length = hashToCollection(this.getPOSTagsList()).length;
      endWord = ' parts of speech strings';
    }
    const bounds = this.getBoundsForCurrentPage(length);
    const message = `Displaying ${bounds[0] + 1}-${bounds[1]} of ${length}${endWord}`;
    return <p className="label">{message}</p>;
  },

  renderPageNumbers() {
    // var array
    // if(this.state.viewingResponses) {
    //   array = this.gatherVisibleResponses()
    // } else {
    //   array = this.getPOSTagsList()
    // }

    const pageNumbers = _.range(1, this.props.filters.numberOfPages + 1);

    let pageNumberStyle = {};
    const numbersToRender = pageNumbers.map((pageNumber, i) => {
      if (this.props.filters.responsePageNumber === pageNumber) {
        pageNumberStyle = {
          backgroundColor: 'lightblue',
        };
      } else {
        pageNumberStyle = {};
      }
      return (
        <li key={i}>
          <a className="button" style={pageNumberStyle} onClick={() => this.updatePageNumber(pageNumber)}>{pageNumber}</a>
          {/* <a className="button" style={pageNumberStyle} onClick={() => { this.setState({ responsePageNumber: pageNumber, }); }}>{pageNumber}</a> */}
        </li>
      );
    });

    let nextButtonClassName = 'button pagination-extreme-button';
    if (this.props.filters.responsePageNumber === this.getNumberOfPages()) {
      nextButtonClassName += ' is-disabled';
    }
    const nextButton = <a className={nextButtonClassName} onClick={this.incrementPageNumber}>Next</a>;

    let prevButtonClassName = 'button pagination-extreme-button';
    if (this.props.filters.responsePageNumber === 1) {
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
    const questionBar = this.props.filters.responses && Object.keys(this.props.filters.responses).length > 0
    ? <QuestionBar data={_.values(this.formatForQuestionBar())} />
    : <span />;

    return (
      <div style={{ marginTop: 0, paddingTop: 0, }}>
        {questionBar}
        {this.renderRematchAllButton()}
        <h4 className="title is-5" >
          Overview - Total Attempts: <strong>{this.getTotalAttempts()}</strong> | Unique Responses: <strong>{this.getResponseCount()}</strong> | Percentage of weak responses: <strong>{this.getPercentageWeakResponses()}%</strong>
        </h4>
        <div className="tabs is-toggle is-fullwidth">
          {this.renderStatusToggleMenu()}
        </div>
        <div className="columns">
          <div className="column">
            <div className="tabs is-toggle is-fullwidth">
              {this.renderSortingFields()}
            </div>
          </div>
          <div className="column">
            <div className="columns">
              <div className="column">
                {this.renderExpandCollapseAll()}
              </div>
              {this.renderResetAllFiltersButton()}
              {this.renderDeselectAllFiltersButton()}
              {this.renderViewResponsesOrPOSButton()}
            </div>
          </div>
        </div>
        <input className="input" type="text" value={this.props.filters.stringFilter} ref="stringFilter" onChange={this.handleStringFiltering} placeholder="Search responses" />
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
    massEdit: state.massEdit,
  };
}

export default connect(select)(Responses);
