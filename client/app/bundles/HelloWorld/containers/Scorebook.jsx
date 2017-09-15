import React from 'react';
import Scrollify from '../components/modules/scrollify';
import $ from 'jquery';
import _ from 'underscore';
import TableFilterMixin from '../components/general_components/table/sortable_table/table_filter_mixin.js';
import StudentScores from '../components/scorebook/student_scores';
import LoadingIndicator from '../components/shared/loading_indicator';
import ScorebookFilters from '../components/scorebook/scorebook_filters';
import ScoreLegend from '../components/scorebook/score_legend';
import AppLegend from '../components/scorebook/app_legend.jsx';
import EmptyProgressReport from '../components/shared/EmptyProgressReport';

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
      selectedClassroom: this.selectedClassroom(),
      classroomFilters: [],
      unitFilters: [],
      scores: {},
      beginDate: null,
      premium_state: this.props.premium_state,
      endDate: null,
      currentPage: 0,
      loading: false,
      is_last_page: false,
      noLoadHasEverOccurredYet: true,
    };
  },

  componentDidMount() {
    this.fetchData();
    this.modules.scrollify.scrollify('#page-content-wrapper', this);
  },

  formatDate(date) {
    if (date) {
      return `${date.year()}-${date.month() + 1}-${date.date()}`;
    }
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
        selectedClassroom: this.state.selectedClassroom.id,
        no_load_has_ever_occurred_yet: this.state.noLoadHasEverOccurredYet,
      },
      success: this.displayData,
    });
  },

  displayData(data) {
    this.setState({
      classroomFilters: this.getFilterOptions(this.state.classrooms, 'name', 'id', 'Select a Classroom'),
      unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Activity Packs'),
      is_last_page: data.is_last_page,
      premium_state: data.premium_state,
      noLoadHasEverOccurredYet: false,
    });
    const newScores = Object.assign({}, this.state.scores);
    data.scores.forEach((s) => {
      // add the score to the user scores arr or create a new one
      newScores[s.user_id] = newScores[s.user_id] || { name: s.name, scores: [], };
      newScores[s.user_id].scores.push({
        caId: s.ca_id,
        // activitySessionId: s.id,
        userId: s.user_id,
        updated: s.updated_at,
        name: s.activity_name,
        percentage: s.percentage,
        activity_classification_id: s.activity_classification_id, });
    });
    this.setState({ loading: false, scores: newScores, });
  },

  selectedClassroom() {
    if (!this.props.selectedClassroom) {
      return { name: 'None Selected', value: 'none_selected', };
    }
    return this.props.selectedClassroom;
  },

  selectUnit(option) {
    this.setState({
      scores: {},
      currentPage: 0,
      selectedUnit: option,
    }, this.fetchData);
  },

  selectClassroom(option) {
    this.setState({
      scores: {},
      currentPage: 0,
      selectedClassroom: option,
    }, this.fetchData
  );
  },

  selectDates(val1, val2) {
    this.setState({
      scores: {},
      currentPage: 0,
      beginDate: val1,
      endDate: val2,
    }, this.fetchData);
  },

  render() {
    let content,
      loadingIndicator;
    const scores = [];
    for (const userId in this.state.scores) {
      if (this.state.scores.hasOwnProperty(userId)) {
        const sObj = this.state.scores[userId];
        scores.push(<StudentScores key={userId} data={{ scores: sObj.scores, name: sObj.name, activity_name: sObj.activity_name, userId: sObj.userId, }} premium_state={this.props.premium_state} />);
      }
    }
    if (this.state.loading) {
      loadingIndicator = <LoadingIndicator />;
    } else {
      loadingIndicator = null;
    }

    if (this.props.missing) {
      content = <EmptyProgressReport missing={this.props.missing} />;
    } else {
      content = (<span>
        <div className="container">
          <section className="section-content-wrapper">
            <ScorebookFilters selectedClassroom={this.state.selectedClassroom} classroomFilters={this.state.classroomFilters} selectClassroom={this.selectClassroom} selectedUnit={this.state.selectedUnit} unitFilters={this.state.unitFilters} selectUnit={this.selectUnit} selectDates={this.selectDates} />
            <ScoreLegend />
            <AppLegend />
          </section>
        </div>
        {scores}
        {loadingIndicator}
      </span>);
    }
    return (
      <div className="page-content-wrapper">
        <div className="tab-pane" id="scorebook">
          {content}
        </div>
      </div>
    );
  },
});
