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
      classrooms: [],
      selectedUnit: {
        name: 'All Activity Packs',
        value: '',
      },
      selectedClassroom: this.selectedClassroom(),
      // {
      //   name: 'All Classrooms',
      //   value: ''
      // },
      classroomFilters: [],
      unitFilters: [],
      beginDate: null,
      premium_state: null,
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
      classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
      unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Activity Packs'),
      is_last_page: data.is_last_page,
      premium_state: data.teacher.premium_state,
      noLoadHasEverOccurredYet: false,
    });
    if (this.state.currentPage == 1) {
      this.setState({ scores: data.scores, });
    } else {
      let y1 = this.state.scores;
      const new_scores = [];
      _.forEach(data.scores, (score) => {
        const user_id = score.user.id;
        const y2 = _.find(y1, ele => ele.user.id == user_id);
        if (y2 == undefined) {
          new_scores.push(score);
        } else {
          y1 = _.map(y1, (ele) => {
            if (ele == y2) {
              ele.results = ele.results.concat(score.results);
              ele.results = _.uniq(ele.results, w1 => w1.id);
            }
            const w1 = ele;
            return w1;
          });
        }
      });
      const all_scores = y1.concat(new_scores);
      this.setState({ scores: all_scores, });
    }
    this.setState({ loading: false, });
  },

  selectedClassroom() {
    if (!this.props.selectedClassroom) {
      return { name: 'All Classrooms', value: '', };
    }
    return this.props.selectedClassroom;
  },

  selectUnit(option) {
    this.setState({
      currentPage: 0,
      selectedUnit: option,
    }, this.fetchData);
  },

  selectClassroom(option) {
    this.setState({
      currentPage: 0,
      selectedClassroom: option,
    }, this.fetchData
  );
  },
  selectDates(val1, val2) {
    this.setState({
      currentPage: 0,
      beginDate: val1,
      endDate: val2,
    }, this.fetchData);
  },

  render() {
    let content,
      loadingIndicator;
    const scores = _.map(this.state.scores, function (data) {
      return <StudentScores key={data.user.id} data={data} premium_state={this.state.premium_state} />;
    }, this);

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
