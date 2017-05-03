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
import ConceptSelector from '../shared/conceptSelector.jsx';
import QuestionBar from './questionBar.jsx';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  submitNewConceptResult,
  deleteConceptResult,
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
      actions,
      viewingResponses: true,
      responsePageNumber: 1,
      matcher,
      stringFilter: '',
      selectedResponses: [],
      selectedMassEditBoilerplateCategory: '',
      newMassEditConceptResultConceptUID: '',
      newMassEditConceptResultCorrect: false,
      massEditSummaryListDisplay: 'none',
      massEditSummaryListButtonText: 'Expand List',
    };
  },

  componentWillUnmount() {
    this.clearResponsesFromMassEditArray();
  },

  getTotalAttempts() {
    return _.reduce(this.props.responses, (memo, item) => memo + item.count, 0);
  },

  getResponseCount() {
    if (this.props.responses) {
      return hashToCollection(this.props.responses).length;
    }
  },

  chooseMassEditBoilerplateCategory(e) {
    this.setState({ selectedMassEditBoilerplateCategory: e.target.value, });
  },

  chooseMassEditSpecificBoilerplateFeedback(e) {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.setState({ selectedMassEditBoilerplate: '', });
    } else {
      this.setState({ selectedMassEditBoilerplate: e.target.value, });
    }
  },

  clearResponsesFromMassEditArray() {
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
  },

  removeResponseFromMassEditArray(responseKey) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  },

  incrementAllResponsesInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    selectedResponses.forEach(response => this.props.dispatch(incrementResponseCount(this.props.questionID, response)));
  },

  updateAllResponsesInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    const newResp = {
      weak: false,
      feedback: this.state.massEditFeedback,
      optimal: this.refs.massEditOptimal.checked,
    };
    selectedResponses.forEach((responseKey) => {
      const uniqVals = Object.assign({}, newResp, {
        gradeIndex: `human${responseKey}`,
      });
      this.props.dispatch(submitResponseEdit(responseKey, uniqVals));
      this.props.dispatch(removeLinkToParentID(responseKey));
    });
  },

  deleteAllResponsesInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    if (window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
      selectedResponses.forEach(response => this.props.dispatch(deleteResponse(this.props.questionID, response)));
      this.clearResponsesFromMassEditArray();
    }
  },

  addMassEditConceptResults() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    const newMassEditConceptResultConceptUID = this.state.newMassEditConceptResultConceptUID;

    selectedResponses.forEach((responseKey) => {
      const currentConceptResultsForResponse = this.props.responses[responseKey].conceptResults || {};
      const conceptResultUidsArrayForResponse = Object.keys(currentConceptResultsForResponse).map(concept => this.props.responses[responseKey].conceptResults[concept].conceptUID);
      if (conceptResultUidsArrayForResponse.includes(newMassEditConceptResultConceptUID)) {
        const conceptKey = _.compact(_.map(currentConceptResultsForResponse, (concept, conceptValues) => {
          if (concept.conceptUID == newMassEditConceptResultConceptUID) {
            return concept;
          } else {
            return null;
          }
        }))[0].key;
        this.props.dispatch(deleteConceptResult(this.props.questionID, responseKey, conceptKey));
      }

      this.props.dispatch(submitNewConceptResult(this.props.questionID, responseKey, {
        conceptUID: newMassEditConceptResultConceptUID,
        correct: this.state.newMassEditConceptResultCorrect,
      }));
    });
  },

  handleMassEditFeedbackTextChange(value) {
    this.setState({ massEditFeedback: value, });
  },

  selectMassEditConceptForResult(e) {
    this.setState({ newMassEditConceptResultConceptUID: e.value, });
  },

  updateMassEditConceptResultCorrect() {
    this.setState({ newMassEditConceptResultCorrect: this.refs.massEditConceptResultsCorrect.checked, });
  },

  toggleMassEditSummaryList() {
    let display = 'none';
    let text = 'Expand List';
    if (this.state.massEditSummaryListButtonText == 'Expand List') {
      display = 'block';
      text = 'Collapse List';
    }
    this.setState({
      massEditSummaryListDisplay: display,
      massEditSummaryListButtonText: text,
    });
  },

  renderMassEditSummaryListResponse(response) {
    return (
      <p><input type="checkbox" defaultChecked checked style={{ marginRight: '0.5em', }} onClick={() => this.removeResponseFromMassEditArray(response)} />{this.props.responses[response].text}</p>
    );
  },

  renderMassEditSummaryList() {
    const summaryResponses = this.props.massEdit.selectedResponses.map((response, i) => this.renderMassEditSummaryListResponse(response));
    return (<div key={i} className="content">{summaryResponses}</div>);
  },

  boilerplateCategoriesToOptions() {
    return getBoilerplateFeedback().map((category, i) => (
      <option key={i} className="boilerplate-feedback-dropdown-option">{category.description}</option>
      ));
  },

  boilerplateSpecificFeedbackToOptions(selectedCategory) {
    return selectedCategory.children.map((childFeedback, i) => (
      <option key={i} className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
      ));
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
    const selectedCategory = _.find(getBoilerplateFeedback(), { description, });
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

  expand(responseKey) {
    this.props.dispatch(filterActions.toggleExpandSingleResponse(responseKey));
  },

  updateRematchedResponse(rid, vals) {
    this.props.dispatch(submitResponseEdit(rid, vals));
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

    const responses = hashToCollection(this.props.responses);
    const unmatchedResponses = _.filter(responses, response =>
      // console.log(response)
       response.author === undefined && response.optimal === undefined && response.count > 1);
    console.log(unmatchedResponses.length, responses.length);
    return ((unmatchedResponses.length / responses.length) * 100).toFixed(2);
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
          text: response.text,
          count: response.count,
          questionUID: response.questionUID,
          gradeIndex: `unmatched${response.questionUID}`,
        };
        this.props.dispatch(
            setUpdatedResponse(rid, newValues)
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
    return hashToCollection(respWithStatus(this.props.responses));
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
    } else {
      return _.mapObject(sortedResponses, (val, key) => ({
        value: val / totalResponseCount * 100,
        color: colors[key],
      }));
    }
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
      const responsesListItems = this.getResponsesForCurrentPage(this.getFilteredResponses(responses));
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
              responsePageNumber: 1,
            });
          }}
        >Show {this.state.viewingResponses ? 'POS' : 'Uniques'}</button>
      </div>
    );
  },

  renderResetAllFiltersButton() {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.resetFields}>Reset</button>
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
    this.setState({ stringFilter: this.refs.stringFilter.value, responsePageNumber: 1, });
  },

  getFilteredResponses(responses) {
    if (this.state.stringFilter == '') {
      return responses;
    }
    const that = this;
    return _.filter(responses, response => response.text.indexOf(that.state.stringFilter) >= 0);
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
    const numbersToRender = pageNumbers.map((pageNumber, i) => {
      if (this.state.responsePageNumber === pageNumber) {
        pageNumberStyle = {
          backgroundColor: 'lightblue',
        };
      } else {
        pageNumberStyle = {};
      }
      return (
        <li key={i}>
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

  renderMassEditForm() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    if (selectedResponses.length > 1) {
      return (
        <div>
          <div className="card is-fullwidth has-bottom-margin has-top-margin">
            <header className="card-content expanded">
              <div className="content">
                <h1 className="title is-3" style={{ marginBottom: '0', }}><strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses Selected for Mass Editing:</h1>
              </div>
            </header>
            <div className="card-content" style={{ display: this.state.massEditSummaryListDisplay, }}>
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
              <h1 className="title is-3" style={{ display: 'inline-block', }}>Modify Feedback for <strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses</h1>
            </header>
            <div className="card-content">
              <div className="content">
                <h3>FEEDBACK <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ All other feedback associated with selected responses will be overwritten ⚠️️</span></h3>
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
                  <h3><input ref="massEditOptimal" defaultChecked={false} type="checkbox" /> OPTIMAL <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ All selected responses will be marked with this optimality ⚠️️</span></h3>
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
              <h1 className="title is-3" style={{ display: 'inline-block', }}>Add Concept Results for <strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses</h1>
            </header>
            <div className="card-content">
              <div className="content">
                <h3>ADD CONCEPT RESULTS <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ This concept result will be added to all selected responses ⚠️️</span></h3>
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
      );
    }
  },

  render() {
    return (
      <div style={{ marginTop: 0, paddingTop: 0, }}>
        <QuestionBar data={_.values(this.formatForQuestionBar())} />{this.renderRematchAllButton()}
        <h4 className="title is-5" >
          Overview - Total Attempts: <strong>{this.getTotalAttempts()}</strong> | Unique Responses: <strong>{this.getResponseCount()}</strong> | Percentage of weak reponses: <strong>{this.getPercentageWeakResponses()}%</strong>
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
              {this.renderViewResponsesOrPOSButton()}
            </div>
          </div>
        </div>
        <input className="input" type="text" value={this.state.stringFilter} ref="stringFilter" onChange={this.handleStringFiltering} placeholder="Search responses" />
        {this.renderDisplayingMessage()}
        {this.renderPageNumbers()}
        {this.renderResponses()}
        {this.renderPOSStrings()}
        {this.renderPageNumbers()}
        {this.renderMassEditForm()}
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
