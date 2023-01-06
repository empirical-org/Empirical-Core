import React from 'react';
import createReactClass from 'create-react-class';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import Scrollify from '../components/modules/scrollify';
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../components/progress_reports/progress_report_constants'
import TableFilterMixin from '../components/general_components/table/sortable_table/table_filter_mixin.js';
import StudentScores from '../components/scorebook/student_scores';
import LoadingIndicator from '../components/shared/loading_indicator';
import ScorebookFilters from '../components/scorebook/scorebook_filters';
import ScoreLegend from '../components/scorebook/score_legend';
import { AppLegend } from '../components/scorebook/app_legend.tsx';
import EmptyProgressReport from '../components/shared/EmptyProgressReport';
import { requestGet, } from '../../../modules/request/index'

export default createReactClass({
  displayName: 'Scorebook',

  mixins: [TableFilterMixin],

  getInitialState() {
    const { allClassrooms, selectedClassroom, premium_state, } = this.props
    this.modules = {
      scrollify: new Scrollify(),
    };
    const allActivityPacksUnit = {
      name: 'All activity packs',
      value: '',
    };
    return {
      units: [],
      classrooms: allClassrooms,
      selectedUnit: allActivityPacksUnit,
      selectedClassroom: selectedClassroom,
      classroomFilters: allClassrooms,
      unitFilters: [],
      scores: new Map(),
      beginDate: null,
      premium_state: premium_state,
      endDate: null,
      loading: false,
      is_last_page: false,
      noLoadHasEverOccurredYet: true,
      anyScoresHaveLoadedPreviously: localStorage.getItem('anyScoresHaveLoadedPreviously') || false,
    };
  },

  componentDidMount() {
    const { selectedClassroom, } = this.props
    if (selectedClassroom) {
      this.getUpdatedUnits(selectedClassroom.value);
    } else {
      this.setStateFromLocalStorage(this.fetchData);
    }
    this.modules.scrollify.scrollify('#page-content-wrapper', this);
  },

  DATE_RANGE_FILTER_OPTIONS: [
    {
      title: 'Today',
      beginDate: moment(),
    },
    {
      title: 'This Week',
      beginDate: moment().startOf('week'),
    },
    {
      title: 'This Month',
      beginDate: moment().startOf('month'),
    },
    {
      title: 'Last 7 days',
      beginDate: moment().subtract(7, 'days'),
    },
    {
      title: 'Last 30 days',
      beginDate: moment().subtract(1, 'months'),
    },
    {
      title: 'All Time',
      beginDate: null,
    }
  ],

  formatDate(date) {
    if (date) {
      const standardizedDate = moment.utc(date);
      return `${standardizedDate.year()}-${standardizedDate.month() + 1}-${standardizedDate.date()}`;
    }
  },

  setStateFromLocalStorage(callback) {
    const { allClassrooms, } = this.props
    const { classrooms, } = this.state
    const state = {};
    const storedSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID);
    const storedDateFilterName = window.localStorage.getItem('scorebookDateFilterName');
    const dateFilterName = !storedDateFilterName || storedDateFilterName === 'null' ? null : storedDateFilterName;
    if (storedSelectedClassroomId) {
      const selectedClassroom = classrooms.find(c => Number(c.id) === Number(storedSelectedClassroomId));
      if (selectedClassroom) {
        state.selectedClassroom = selectedClassroom;
      } else {
        state.selectedClassroom = allClassrooms[0]
      }
    } else {
      state.selectedClassroom = allClassrooms[0]
    }
    if (state.selectedClassroom) {
      this.getUpdatedUnits(state.selectedClassroom.id)
    }
    if (dateFilterName) {
      const dateRangeFilterOption = this.DATE_RANGE_FILTER_OPTIONS.find(o => o.title === dateFilterName)
      if (dateRangeFilterOption) {
        const beginDate = dateRangeFilterOption.beginDate
        window.localStorage.setItem('scorebookBeginDate', beginDate);
        state.beginDate = beginDate;
        state.dateFilterName = dateFilterName;
        this.setState(state, callback);
      } else {
        state.beginDate = this.convertStoredDateToMoment(window.localStorage.getItem('scorebookBeginDate'));
        this.setState(state, callback);
      }
    } else {
      state.beginDate = this.convertStoredDateToMoment(window.localStorage.getItem('scorebookBeginDate'));
      this.setState(state, callback);
    }
  },

  fetchData() {
    const {
      selectedClassroom,
      selectedUnit,
      beginDate,
      endDate,
      noLoadHasEverOccurredYet,
    } = this.state
    this.setState({ loading: true });
    if (!selectedClassroom) {
      this.setState({ missing: 'classrooms', loading: false, });
      return;
    }
    $.ajax({
      url: '/teachers/classrooms/scores',
      data: {
        classroom_id: selectedClassroom.value,
        unit_id: selectedUnit.value,
        begin_date: this.formatDate(beginDate),
        end_date: this.formatDate(endDate),
        no_load_has_ever_occurred_yet: noLoadHasEverOccurredYet,
      },
      success: this.displayData,
    });
  },

  getUpdatedUnits(classroomId) {
    const loadingUnit = { name: 'Loading...', value: '', };
    this.setState({ unitFilters: [loadingUnit], selectedUnit: loadingUnit, });
    const that = this;
    requestGet(
      `${process.env.DEFAULT_URL}/teachers/classrooms/${classroomId}/units`,
      (body) => {
        const units = body.units;
        const { scores, } = this.state
        if (units.length === 1) {
          const selectedUnit = units[0];
          that.setState({
            unitFilters: units,
            selectedUnit,
            missing: this.checkMissing(scores),
          });
        } else {
          const selectedUnit = { name: 'All activity packs', value: '', };
          that.setState({
            unitFilters: [selectedUnit].concat(units),
            selectedUnit,
            missing: this.checkMissing(scores),
          });
        }
      }
    )
  },

  checkMissing(scores) {
    const { anyScoresHaveLoadedPreviously, classroomFilters, unitFilters, } = this.state
    if (!(anyScoresHaveLoadedPreviously == 'true') && scores.size > 0) {
      this.setState({ anyScoresHaveLoadedPreviously: true ,});
      localStorage.setItem('anyScoresHaveLoadedPreviously', true);
    }
    if (!classroomFilters || classroomFilters.length === 0) {
      return 'classrooms';
    } else if (anyScoresHaveLoadedPreviously == 'true' && (!scores || scores.size === 0)) {
      return 'activitiesWithinDateRange';
    } else if (unitFilters.length && (!scores || scores.size === 0)) {
      return 'students';
    } else if (!scores || scores.size === 0) {
      return 'activities';
    }
  },

  displayData(data) {
    const { allClassrooms, } = this.props
    const { scores, } = this.state
    this.setState({
      classroomFilters: allClassrooms,
      is_last_page: data.is_last_page,
      premium_state: data.premium_state,
      noLoadHasEverOccurredYet: false,
    });
    const newScores = new Map(scores);
    data.scores.forEach((s) => {
      // add the score to the user scores arr or create a new one
      newScores.has(s.user_id) || newScores.set(s.user_id, { name: s.name, scores: [], });
      const scores = newScores.get(s.user_id).scores;
      scores.push({
        cuId: s.classroom_unit_id,
        // activitySessionId: s.id,
        activityId: s.activity_id,
        userId: s.user_id,
        updated: s.updated_at,
        name: s.activity_name,
        percentage: s.percentage,
        timespent: s.timespent,
        started: s.started ? Number(s.started) : 0,
        started_at: s.started_at,
        completed_attempts: s.completed_attempts ? Number(s.completed_attempts) : 0,
        marked_complete: s.marked_complete,
        activity_description: s.activity_description,
        activity_classification_id: s.activity_classification_id,
        dueDate: s.due_date,
        publishDate: s.publish_date,
        unitActivityCreatedAt: s.unit_activity_created_at,
        scheduled: s.scheduled,
        locked: s.locked
      });
    });
    this.setState({ loading: false, scores: newScores, missing: this.checkMissing(newScores), });
  },

  selectUnit(option) {
    this.setState({
      scores: new Map(),
      selectedUnit: option,
    }, this.fetchData);
  },

  selectClassroom(option) {
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, option.id);
    this.getUpdatedUnits(option.value);
    this.setState({
      scores: new Map(),
      selectedClassroom: option,
    }, this.fetchData
    );
  },

  selectDates(beginDate, endDate, dateFilterName) {
    window.localStorage.setItem('scorebookBeginDate', beginDate);
    window.localStorage.setItem('scorebookDateFilterName', dateFilterName);
    this.setState({
      scores: new Map(),
      beginDate,
      endDate,
      dateFilterName,
    }, this.fetchData);
  },

  convertStoredDateToMoment(savedString) {
    if(savedString && savedString !== 'null') {
      return moment(savedString)
    }
    return null;

  },

  render() {
    const { premium_state, } = this.props
    const {
      scores,
      loading,
      missing,
      beginDate,
      classroomFilters,
      dateFilterName,
      endDate,
      selectedClassroom,
      selectedUnit,
      unitFilters,
    } = this.state
    let content,
      loadingIndicator;
    const scoresForDisplay = [];
    let index = 0;
    scores.forEach((s) => {
      index += 0;
      const sData = s.scores[0];
      scoresForDisplay.push(<StudentScores data={{ scores: s.scores, name: s.name, activity_name: sData.activity_name, userId: sData.userId, classroomId: selectedClassroom.id, }} key={`${sData.userId}`} premium_state={premium_state} />);
    });

    if (loading) {
      content = <div>{scoresForDisplay}<LoadingIndicator /></div>;
    } else if (missing) {
      const onButtonClick = missing == 'activitiesWithinDateRange' ? () => { this.selectDates(null, null); } : null;
      content = <EmptyProgressReport missing={missing} onButtonClick={onButtonClick} />;
    } else {
      content = <div>{scoresForDisplay}</div>;
    }

    return (
      <div className="page-content-wrapper">
        <div className="tab-pane" id="scorebook">
          <div className="container">
            <section className="section-content-wrapper">
              <ScorebookFilters
                beginDate={beginDate}
                classroomFilters={classroomFilters}
                dateFilterName={dateFilterName}
                dateRangeFilterOptions={this.DATE_RANGE_FILTER_OPTIONS}
                endDate={endDate}
                selectClassroom={this.selectClassroom}
                selectDates={this.selectDates}
                selectedClassroom={selectedClassroom}
                selectedUnit={selectedUnit}
                selectUnit={this.selectUnit}
                unitFilters={unitFilters}
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
