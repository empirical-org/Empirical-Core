import React from 'react';
import Scrollify from '../components/modules/scrollify';
import $ from 'jquery';
import request from 'request';
import _ from 'underscore';
import TableFilterMixin from '../components/general_components/table/sortable_table/table_filter_mixin.js';
import StudentScores from '../components/scorebook/student_scores';
import LoadingIndicator from '../components/shared/loading_indicator';
import ScorebookFilters from '../components/scorebook/scorebook_filters';
import ScoreLegend from '../components/scorebook/score_legend';
import AppLegend from '../components/scorebook/app_legend.jsx';
import EmptyProgressReport from '../components/shared/EmptyProgressReport';
import moment from 'moment';

export default React.createClass({
  mixins: [TableFilterMixin],

  getInitialState() {
    this.modules = {
      scrollify: new Scrollify(),
    };
    return {
      units: [],
      classrooms: this.props.allClassrooms,
      selectedUnit: {
        name: 'All Activity Packs',
        value: '',
      },
      selectedClassroom: this.props.selectedClassroom,
      classroomFilters: this.props.allClassrooms,
      unitFilters: [],
      scores: new Map(),
      beginDate: null,
      premium_state: this.props.premium_state,
      endDate: null,
      currentPage: 0,
      loading: false,
      is_last_page: false,
      noLoadHasEverOccurredYet: true,
      anyScoresHaveLoadedPreviously: localStorage.getItem('anyScoresHaveLoadedPreviously') || false
    };
  },

  componentDidMount() {
    this.setStateFromLocalStorage(this.fetchData);
    this.getUpdatedUnits(this.props.selectedClassroom.value);
    this.modules.scrollify.scrollify('#page-content-wrapper', this);
  },

  formatDate(date) {
    if (date) {
      return `${date.year()}-${date.month() + 1}-${date.date()}`;
    }
  },

  setStateFromLocalStorage(callback) {
    this.setState({
      beginDate: this.convertStoredDateToMoment(window.localStorage.getItem('scorebookBeginDate')),
      endDate: this.convertStoredDateToMoment(window.localStorage.getItem('scorebookEndDate'))
    }, callback);
  },

  fetchData() {
    const newCurrentPage = this.state.currentPage + 1;
    this.setState({ loading: true, currentPage: newCurrentPage, });
    $.ajax({
      url: '/teachers/classrooms/scores',
      data: {
        current_page: newCurrentPage,
        classroom_id: this.state.selectedClassroom.value,
        unit_id: this.state.selectedUnit.value,
        begin_date: this.formatDate(this.state.beginDate),
        end_date: this.formatDate(this.state.endDate),
        no_load_has_ever_occurred_yet: this.state.noLoadHasEverOccurredYet,
      },
      success: this.displayData,
    });
  },

  getUpdatedUnits(classroomId) {
    const loadingUnit = { name: 'Loading...', value: '', };
    this.setState({ unitFilters: [loadingUnit], selectedUnit: loadingUnit, });
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classrooms/${classroomId}/units`,
    }, (error, httpStatus, body) => {
      const parsedBody = JSON.parse(body);
      that.setState({
        unitFilters: parsedBody.units,
        selectedUnit: { name: 'All Activity Packs', value: '', },
        missing: this.checkMissing(this.state.scores)
      });
    });
  },

  checkMissing(scores) {
    if(!this.state.anyScoresHaveLoadedPreviously && scores.size > 0) {
      this.setState({anyScoresHaveLoadedPreviously: true});
      localStorage.setItem('anyScoresHaveLoadedPreviously', true);
    }
    if (!this.state.classroomFilters || this.state.classroomFilters.length === 0) {
      return 'classrooms';
    } else if(this.state.anyScoresHaveLoadedPreviously && (!scores || scores.size === 0)) {
      return 'activitiesWithinDateRange';
    } else if (this.state.unitFilters.length && (!scores || scores.size === 0)) {
      return 'students';
    } else if (!scores || scores.size === 0) {
      return 'activities';
    }
  },

  displayData(data) {
    this.setState({
      classroomFilters: this.props.allClassrooms,
      is_last_page: data.is_last_page,
      premium_state: data.premium_state,
      noLoadHasEverOccurredYet: false,
    });
    const newScores = new Map(this.state.scores);
    data.scores.forEach((s) => {
      // add the score to the user scores arr or create a new one
      newScores.has(s.user_id) || newScores.set(s.user_id, { name: s.name, scores: [], });
      const scores = newScores.get(s.user_id).scores;
      scores.push({
        caId: s.ca_id,
        // activitySessionId: s.id,
        userId: s.user_id,
        updated: s.updated_at,
        name: s.activity_name,
        percentage: s.percentage,
        started: s.started ? Number(s.started) : 0,
        completed_attempts: s.completed_attempts ? Number(s.completed_attempts) : 0,
        activity_classification_id: s.activity_classification_id, });
    });
    this.setState({ loading: false, scores: newScores, missing: this.checkMissing(newScores), });
  },

  selectUnit(option) {
    this.setState({
      scores: new Map(),
      currentPage: 0,
      selectedUnit: option,
    }, this.fetchData);
  },

  selectClassroom(option) {
    this.getUpdatedUnits(option.value);
    this.setState({
      scores: new Map(),
      currentPage: 0,
      selectedClassroom: option,
    }, this.fetchData
  );
  },

  selectDates(val1, val2) {
    window.localStorage.setItem('scorebookBeginDate', val1);
    window.localStorage.setItem('scorebookEndDate', val2);
    this.setState({
      scores: new Map(),
      currentPage: 0,
      beginDate: val1,
      endDate: val2,
    }, this.fetchData);
  },

  convertStoredDateToMoment(savedString) {
    if(savedString && savedString !== 'null') {
      return moment(savedString)
    } else {
      return null;
    }
  },

  render() {
    let content,
      loadingIndicator;
    const scores = [];
    let index = 0;
    this.state.scores.forEach((s) => {
      index += 0;
      const sData = s.scores[0];
      scores.push(<StudentScores key={`${sData.userId}`} data={{ scores: s.scores, name: s.name, activity_name: sData.activity_name, userId: sData.userId, classroomId: this.state.selectedClassroom.id }} premium_state={this.props.premium_state} />);
    });
    if (this.state.loading) {
      loadingIndicator = <LoadingIndicator />;
    } else {
      loadingIndicator = null;
    }

    if (this.state.missing) {
      const onButtonClick = this.state.missing == 'activitiesWithinDateRange' ? () => { this.selectDates(null, null); } : null;
      content = <EmptyProgressReport missing={this.state.missing} onButtonClick={onButtonClick} />;
    } else {
      content =
        (<div>
          {scores}
          {loadingIndicator}
        </div>);
    }
    return (
      <div className="page-content-wrapper">
        <div className="tab-pane" id="scorebook">
          <div className="container">
            <section className="section-content-wrapper">
              <ScorebookFilters
                selectedClassroom={this.state.selectedClassroom}
                classroomFilters={this.state.classroomFilters}
                selectClassroom={this.selectClassroom}
                selectedUnit={this.state.selectedUnit}
                unitFilters={this.state.unitFilters}
                selectUnit={this.selectUnit} selectDates={this.selectDates}
                beginDate={this.state.beginDate}
                endDate={this.state.endDate}
              />
              <ScoreLegend />
              <AppLegend />
            </section>
          </div>
          {content}
        </div>
      </div>
    );
  },
});
