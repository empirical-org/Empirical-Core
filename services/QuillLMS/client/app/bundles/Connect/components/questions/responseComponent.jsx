import React from 'react';
import { connect } from 'react-redux';

import filterActions from '../../actions/filters';
import _ from 'underscore';
import ResponseList from './responseList.jsx';
import QuestionMatcher from '../../libs/question';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import { getPartsOfSpeechTags } from '../../libs/partsOfSpeechTagging.js';
import POSForResponsesList from './POSForResponsesList.jsx';
import respWithStatus from '../../libs/responseTools.js';
import POSMatcher from '../../libs/sentenceFragment.js';
import {
  rematchAll,
  rematchOne
} from '../../libs/grading/rematching.ts';
import massEdit from '../../actions/massEdit';
import { submitResponseEdit } from '../../actions/responses';
import {
  ResponseSortFields,
  ResponseToggleFields,
  QuestionBar,
  hashToCollection
} from '../../../Shared/index'
import { requestGet, } from '../../../../modules/request/index'

const C = require('../../constants').default;

const labels = C.ERROR_AUTHORS;
const qualityLabels = ['Human Optimal', 'Human Sub-Optimal', 'Algorithm Optimal', 'Algorithm Sub-Optimal', 'Unmatched'];
const colors = ['#81c784', '#ffb74d', '#BA68C8', '#5171A5', '#e57373'];

const responsesPerPage = 20;

class ResponseComponent extends React.Component {
  constructor(props) {
    super(props)
    let actions;
    let matcher;
    if (this.props.mode === 'sentenceFragments') {
      actions = sentenceFragmentActions;
      matcher = POSMatcher;
    } else {
      actions = questionActions;
      matcher = QuestionMatcher;
    }
    this.state = {
      percentageOfWeakResponses: 0,
      actions,
      viewingResponses: true,
      matcher,
      selectedResponses: [],
      health: {},
      gradeBreakdown: {},
      enableRematchAllButton: true,
    };
  }

  componentDidMount() {
    this.getNecessaryData()
  }

  componentDidUpdate(prevProps) {
    const { filters, states, questionID, dispatch, } = this.props
    if (!_.isEqual(filters.formattedFilterData, prevProps.filters.formattedFilterData)) {
      this.searchResponses();
    } else if (states[questionID] === C.SHOULD_RELOAD_RESPONSES && prevProps.states[prevProps.questionID] !== C.SHOULD_RELOAD_RESPONSES) {
      dispatch(questionActions.clearQuestionState(questionID));
      this.searchResponses();
    } else if (prevProps.questionID !== questionID) {
      this.getNecessaryData()
      this.unsubscribeToQuestion(prevProps.questionID);
    }
  }

  componentWillUnmount() {
    const { questionID } = this.props
    this.unsubscribeToQuestion(questionID)
    this.clearResponses();
  }

  getNecessaryData = () => {
    const { questionID, dispatch, } = this.props
    this.searchResponses();
    this.getHealth();
    this.getGradeBreakdown();
    dispatch(questionActions.initializeSubscription(questionID));
  }

  unsubscribeToQuestion = (questionID) => {
    const { dispatch, } = this.props
    dispatch(questionActions.removeSubscription(questionID));
  }

  getBoundsForCurrentPage = length => {
    const startIndex = (this.props.filters.responsePageNumber - 1) * responsesPerPage;
    const endIndex = startIndex + responsesPerPage > length ? length : startIndex + responsesPerPage;
    return [startIndex, endIndex];
  };

  getChildResponses = responseID => {
    const responses = hashToCollection(this.props.responses);
    return _.where(responses, { parentID: responseID, });
  };

  getErrorsForAttempt = attempt => {
    return attempt.feedback;
  };

  getFilteredResponses = responses => {
    if (this.props.filters.stringFilter == '') {
      return responses;
    }
    const that = this;
    return _.filter(responses, response => response.text.indexOf(that.props.filters.stringFilter) >= 0);
  };

  getGradeBreakdown = () => {
    requestGet(
      `${import.meta.env.QUILL_CMS}/questions/${this.props.questionID}/grade_breakdown`,
      (body) => {
        this.setState({
          gradeBreakdown: body,
        });
      }
    )
  };

  getHealth = () => {
    requestGet(
      `${import.meta.env.QUILL_CMS}/questions/${this.props.questionID}/health`,
      (body) => {
        this.setState({
          health: body,
        });
      }
    )
  };

  getNumberOfPages = () => {
    return this.props.filters.numberOfPages;
  };

  getPOSTagsList = () => {
    const responses = this.gatherVisibleResponses();
    const responsesWithPOSTags = responses.map((response) => {
      response.posTags = getPartsOfSpeechTags(response.text.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')); // some text has html tags
      return response;
    });

    let posTagsList = {},
      posTagsAsString = '';
    responses.forEach((response) => {
      posTagsAsString = response.posTags ? response.posTags.join() : '';
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
  };

  getPercentageWeakResponses = () => {
    const { common_unmatched_responses, total_number_of_responses } = this.state.health
    return common_unmatched_responses > 0 ? (common_unmatched_responses/total_number_of_responses * 100).toFixed(2) : 0.0
  };

  getResponse = responseID => {
    return this.props.filters.responses[responseID];
  };

  getResponseCount = () => {
    return this.state.health.total_number_of_responses;
  };

  getResponsesForCurrentPage = responses => {
    return responses;
  };

  getTotalAttempts = () => {
    return this.state.health.total_number_of_attempts;
  };

  allClosed = () => {
    const expanded = this.props.filters.expanded;
    for (const i in expanded) {
      if (expanded[i] === true) return false;
    }
    return true;
  };

  clearResponses = () => {
    this.props.dispatch(questionActions.updateResponses({ responses: [], numberOfResponses: 0, numberOfPages: 1, responsePageNumber: 1, }));
  };

  collapseAllResponses = () => {
    this.props.dispatch(filterActions.collapseAllResponses());
  };

  decrementPageNumber = () => {
    if (this.props.filters.responsePageNumber !== 1) {
      this.updatePageNumber(this.props.filters.responsePageNumber - 1);
    }
  };

  deselectFields = () => {
    this.props.dispatch(filterActions.deselectAllFields());
  };

  expand = responseKey => {
    this.props.dispatch(filterActions.toggleExpandSingleResponse(responseKey));
  };

  expandAllResponses = () => {
    const responses = this.responsesWithStatus();
    const newExpandedState = this.props.filters.expanded;
    for (let i = 0; i < responses.length; i++) {
      newExpandedState[responses[i].key] = true;
    }
    this.props.dispatch(filterActions.expandAllResponses(newExpandedState));
  };

  formatForQuestionBar = () => {
    const totalResponseCount = this.state.health.total_number_of_attempts;
    if (totalResponseCount == 0) {
      return [{
        value: 100,
        color: '#eeeeee',
      }];
    }
    return _.mapObject(this.state.gradeBreakdown, (val, key) => ({
      value: val / totalResponseCount * 100,
      color: colors[qualityLabels.indexOf(key)],
    }));
  };

  gatherVisibleResponses = () => {
    return this.responsesWithStatus();
  };

  generateFeedbackString = attempt => {
    return this.getErrorsForAttempt(attempt);
  };

  handleSearchEnter = (e) => {
    if(e.key === "Enter") {
      this.searchResponses();
    }
  }

  handleStringFiltering = () => {
    const { dispatch, questionID } = this.props;
    const { stringFilter } = this.refs;
    const { value } = stringFilter;
    dispatch(questionActions.updateStringFilter(value, questionID));
  }

  incrementPageNumber = () => {
    if (this.props.filters.responsePageNumber < this.getNumberOfPages()) {
      this.updatePageNumber(this.props.filters.responsePageNumber + 1);
    }
  };

  rematchAllResponses = () => {
    this.setState({enableRematchAllButton: false});
    const pageNumber = 1;
    const callback = (done) => {
      if (done) {
        this.searchResponses();
        this.getHealth();
        this.getGradeBreakdown();
      }
    };
    const weak = rematchAll(this.props.mode, this.props.questionID, callback);
  };

  rematchResponse = rid => {
    const response = this.props.filters.responses[rid];
    const callback = this.searchResponses;
    rematchOne(response, this.props.mode, this.props.question, this.props.questionID, callback);
  };

  removeResponseFromMassEditArray = responseKey => {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  };

  resetFields = () => {
    this.props.dispatch(filterActions.resetAllFields());
  };

  resetPageNumber = () => {
    this.updatePageNumber(1);
  };

  responsesByStatusCodeAndResponseCount = () => {
    return _.mapObject(this.responsesGroupedByStatus(), (val, key) => _.reduce(val, (memo, resp) => memo + (resp.count || 0), 0));
  };

  responsesGroupedByStatus = () => {
    return _.groupBy(this.responsesWithStatus(), 'statusCode');
  };

  responsesWithStatus = () => {
    return hashToCollection(respWithStatus(this.props.filters.responses));
  };

  searchResponses = () => {
    const { dispatch, questionID } = this.props;
    dispatch(questionActions.incrementRequestCount())
    dispatch(questionActions.searchResponses(questionID));
  }

  toggleExcludeMisspellings = () => {
    this.props.dispatch(filterActions.toggleExcludeMisspellings());
  };

  toggleField = status => {
    this.props.dispatch(filterActions.toggleStatusField(status));
  };

  toggleResponseSort = field => {
    this.props.dispatch(filterActions.toggleResponseSort(field));
  };

  updatePageNumber = pageNumber => {
    this.props.dispatch(questionActions.updatePageNumber(pageNumber, this.props.questionID));
  };

  updateRematchedResponse = (rid, vals) => {
    this.props.dispatch(submitResponseEdit(rid, vals, this.props.questionID));
  };

  incorrectSequenceNames = () => {
    const { question } = this.props
    const { incorrectSequences } = question

    let incorrectSequenceNames = []
    if (Array.isArray(incorrectSequences)) {
      incorrectSequenceNames = incorrectSequences.map(i => i.name)
    } else if (incorrectSequences) {
      incorrectSequenceNames = Object.keys(incorrectSequences).map((key) => incorrectSequences[key].name)
    }
    return incorrectSequenceNames.filter(f => f !== undefined)
  }

  focusPointNames = () => {
    const { question } = this.props
    const { focusPoints } = question

    let focusPointNames = []
    if (Array.isArray(focusPoints)) {
      focusPointNames = focusPoints.map(fp => fp.name)
    } else if (focusPoints) {
      focusPointNames = Object.keys(focusPoints).map((key) => focusPoints[key].name)
    }
    return focusPointNames.filter(f => f !== undefined)
  }

  renderDeselectAllFiltersButton = () => {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.deselectFields}>Deselect All Filters</button>
      </div>
    );
  };

  renderDisplayingMessage = () => {
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
  };

  renderExpandCollapseAll = () => {
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
  };

  renderPOSStrings = () => {
    if (!this.state.viewingResponses) {
      const posTagsList = this.getResponsesForCurrentPage(hashToCollection(this.getPOSTagsList()));
      return (
        <div>
          <POSForResponsesList posTagsList={posTagsList} />
        </div>
      );
    }
  };

  renderPageNumbers = () => {
    const numberOfPages = this.props.filters.numberOfPages || 0
    const pageNumbers = _.range(1, numberOfPages + 1);

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
          <a className="button" onClick={() => this.updatePageNumber(pageNumber)} style={pageNumberStyle}>{pageNumber}</a>
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
            <ul className="numbers-list">
              {numbersToRender}
            </ul>
            {nextButton}
          </nav>
        </div>
      </div>
    );
  };

  renderRematchAllButton = () => {
    const { filters, admin } = this.props;
    const { progress, enableRematchAllButton } = this.state;

    if (admin) {
      const text = progress ? `${progress}%` : 'Rematch Responses';

      return (<button className="button is-outlined is-danger" disabled={!enableRematchAllButton} onClick={this.rematchAllResponses} style={{ float: 'right', }} type="button">{text}</button>);
    }
  };

  renderResetAllFiltersButton = () => {
    return (
      <div className="column">
        <button className="button is-fullwidth is-outlined" onClick={this.resetFields}>Select All Filters</button>
      </div>
    );
  };

  renderResponses = () => {
    if (this.state.viewingResponses) {
      const { questionID, selectedIncorrectSequences, selectedFocusPoints } = this.props;
      const responsesWStatus = this.responsesWithStatus();
      const responses = _.sortBy(responsesWStatus, 'sortOrder');
      return (
        <ResponseList
          admin={this.props.admin}
          ascending={this.props.filters.ascending}
          conceptID={this.props.question.conceptID}
          concepts={this.props.concepts}
          conceptsFeedback={this.props.conceptsFeedback}
          dispatch={this.props.dispatch}
          expand={this.expand}
          expanded={this.props.filters.expanded}
          getChildResponses={this.getChildResponses}
          getMatchingResponse={this.rematchResponse}
          getResponse={this.getResponse}
          massEdit={this.props.massEdit}
          mode={this.props.mode}
          question={this.props.question}
          questionID={questionID}
          responses={responses}
          selectedFocusPoints={selectedFocusPoints}
          selectedIncorrectSequences={selectedIncorrectSequences}
          states={this.props.states}
        />
      );
    }
  };

  renderSortingFields = () => {
    return (
      <ResponseSortFields
        ascending={this.props.filters.ascending}
        sorting={this.props.filters.sorting}
        toggleResponseSort={this.toggleResponseSort}
      />
    );
  };

  renderStatusToggleMenu = () => {
    let usedQualityLabels = qualityLabels
    const { mode, filters } = this.props
    const { visibleStatuses } = filters
    const regexLabels = this.incorrectSequenceNames().concat(this.focusPointNames())

    if (mode === 'questions') {
      usedQualityLabels = _.without(qualityLabels, 'Algorithm Optimal')
    }

    return (
      <ResponseToggleFields
        deselectFields={this.deselectFields}
        excludeMisspellings={this.props.filters.formattedFilterData.filters.excludeMisspellings}
        labels={labels}
        qualityLabels={usedQualityLabels}
        regexLabels={regexLabels}
        resetFields={this.resetFields}
        resetPageNumber={this.resetPageNumber}
        toggleExcludeMisspellings={this.toggleExcludeMisspellings}
        toggleField={this.toggleField}
        visibleStatuses={visibleStatuses}
      />
    );
  };

  renderViewResponsesOrPOSButton = () => {
    return (
      <div className="column">
        <button
          className="button is-fullwidth is-outlined"
          onClick={() => {
            this.setState({
              viewingResponses: !this.state.viewingResponses,
            }, this.updatePageNumber(1));
          }}
        >Show {this.state.viewingResponses ? 'POS' : 'Uniques'}</button>
      </div>
    );
  };

  render() {
    const { filters, mode } = this.props;
    const { responses, stringFilter } = filters;
    const questionBar = responses && Object.keys(responses).length > 0
      ? <QuestionBar data={_.values(this.formatForQuestionBar())} />
      : <span />;
    const showPosOrUniqueButton = mode === 'questions' ? <span /> : this.renderViewResponsesOrPOSButton()

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
              {showPosOrUniqueButton}
            </div>
          </div>
        </div>
        <div className="search-container">
          <input
            className="input"
            onChange={this.handleStringFiltering}
            onKeyPress={this.handleSearchEnter}
            placeholder="Enter a search term or /regular expression/"
            ref="stringFilter"
            type="text"
            value={stringFilter}
          />
          <button className="button is-outlined is-primary search" onClick={this.searchResponses} type="submit">Search</button>
        </div>
        {this.renderDisplayingMessage()}
        {this.renderPageNumbers()}
        {this.renderResponses()}
        {this.renderPOSStrings()}
        {this.renderPageNumbers()}
      </div>
    );
  }
}

function select(state) {
  return {
    filters: state.filters,
    conceptsFeedback: state.conceptsFeedback,
    concepts: state.concepts,
    massEdit: state.massEdit,
  };
}

export default connect(select)(ResponseComponent);
