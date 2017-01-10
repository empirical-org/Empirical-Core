"use strict";
import React from 'react'
import Scrollify from '../components/modules/scrollify'
import $ from 'jquery'
import _ from 'underscore'
import TableFilterMixin from '../components/general_components/table/sortable_table/table_filter_mixin.js'
import StudentScores from '../components/scorebook/student_scores'
import LoadingIndicator from '../components/general_components/loading_indicator'
import ScorebookFilters from '../components/scorebook/scorebook_filters'
import ScoreLegend from '../components/scorebook/score_legend'
import AppLegend from '../components/scorebook/app_legend.jsx'


export default React.createClass({
  mixins: [TableFilterMixin],

  getInitialState: function() {
    this.modules = {
      scrollify: new Scrollify()
    };
    return {
      units: [],
      classrooms: [],
      selectedUnit: {
        name: 'All Units',
        value: ''
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
      noLoadHasEverOccurredYet: true
    }
  },

  componentDidMount: function() {
    this.fetchData();
    this.modules.scrollify.scrollify('#page-content-wrapper', this);
  },

  fetchData: function() {
    var newCurrentPage = this.state.currentPage + 1;
    this.setState({loading: true, currentPage: newCurrentPage});
    $.ajax({
      url: '/teachers/classrooms/scores',
      data: {
        current_page: newCurrentPage,
        classroom_id: this.state.selectedClassroom.value,
        unit_id: this.state.selectedUnit.value,
        begin_date: this.state.beginDate,
        end_date: this.state.endDate,
        selectedClassroom: this.state.selectedClassroom.id,
        no_load_has_ever_occurred_yet: this.state.noLoadHasEverOccurredYet
      },
      success: this.displayData
    });
  },

  displayData: function(data) {
    this.setState({
      classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
      unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units'),
      is_last_page: data.is_last_page,
      premium_state: data.teacher.premium_state,
      noLoadHasEverOccurredYet: false
    });
    if (this.state.currentPage == 1) {
      this.setState({scores: data.scores});
    } else {
      var y1 = this.state.scores;
      var new_scores = [];
      _.forEach(data.scores, function(score) {
        var user_id = score.user.id;
        var y2 = _.find(y1, function(ele) {
          return ele.user.id == user_id;
        });
        if (y2 == undefined) {
          new_scores.push(score);
        } else {
          y1 = _.map(y1, function(ele) {
            if (ele == y2) {
              ele.results = ele.results.concat(score.results);
              ele.results = _.uniq(ele.results, function(w1) {
                return w1.id;
              });
            }
            var w1 = ele;
            return w1;
          });
        }
      })
      var all_scores = y1.concat(new_scores)
      this.setState({scores: all_scores});
    }
    this.setState({loading: false});
  },

  selectedClassroom: function() {
    if (!this.props.selectedClassroom) {
      return {name: 'All Classrooms', value: ''};
    } else {
      return this.props.selectedClassroom;
    }
  },

  selectUnit: function(option) {
    this.setState({
      currentPage: 0,
      selectedUnit: option
    }, this.fetchData);
  },

  selectClassroom: function(option) {
    this.setState({
      currentPage: 0,
      selectedClassroom: option
    }, this.fetchData
  );
  },
  selectDates: function(val1, val2) {
    this.setState({
      currentPage: 0,
      beginDate: val1,
      endDate: val2
    }, this.fetchData);
  },

  render: function() {
    var scores = _.map(this.state.scores, function(data) {
      return <StudentScores key={data.user.id} data={data} premium_state={this.state.premium_state}/>
    }, this);
    if (this.state.loading) {
      var loadingIndicator = <LoadingIndicator/>;
    } else {
      var loadingIndicator = null;
    }
    return (
      <div id="page-content-wrapper">
         <div className="tab-pane" id="scorebook">
             <span>
                 <div className="container">
                     <section className="section-content-wrapper">
                         <ScorebookFilters selectedClassroom={this.state.selectedClassroom} classroomFilters={this.state.classroomFilters} selectClassroom={this.selectClassroom} selectedUnit={this.state.selectedUnit} unitFilters={this.state.unitFilters} selectUnit={this.selectUnit} selectDates={this.selectDates}/>
                         <ScoreLegend/>
                         <AppLegend/>
                     </section>
                 </div>
                 {scores}
                 {loadingIndicator}
             </span>
         </div>
     </div>
    );
  }
});
