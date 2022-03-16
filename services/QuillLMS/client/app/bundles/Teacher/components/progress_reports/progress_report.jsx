import React from 'react'

import createReactClass from 'create-react-class';

import TableFilterMixin from '../general_components/table/sortable_table/table_filter_mixin'
import TableSortingMixin from '../general_components/table/sortable_table/table_sorting_mixin'
import ExportCsv from './export_csv'
import LoadingIndicator from '../shared/loading_indicator'
import SortableTable from '../general_components/table/sortable_table/sortable_table.jsx'
import FaqLink from './faq_link.jsx'
import { EVIDENCE_KEY, } from './constants'
import ProgressReportFilters from './progress_report_filters.jsx'
import getParameterByName from '../modules/get_parameter_by_name';
import stripHtml from "string-strip-html";
import $ from 'jquery'

export default createReactClass({
  displayName: 'progress_report',

  mixins: [
    TableFilterMixin, TableSortingMixin
  ],

  getDefaultProps: function() {
    return {maxPageNumber: 4};
  },

  getInitialState: function() {
    return {
      currentPage: 1,
      numPages: 1,
      disabled: this.disabled(),
      loading: false,
      results: [],
      classroomFilters: [],
      studentFilters: [],
      unitFilters: [],
      teacher: {},

      selectedClassroom: {
        name: 'All Classrooms',
        value: ''
      },
      selectedStudent: {
        name: 'All Students',
        value: ''
      },
      selectedUnit: {
        name: 'All Activity Packs',
        value: ''
      }
    };
  },

  componentDidMount: function() {
    let sortDefinitions = this.props.sortDefinitions();
    this.defineSorting(sortDefinitions.config, sortDefinitions.default);
    // Pass true to fetchData on mount becuase we only want to use the query params on the first load.
    this.fetchData(true);
  },

  UNSAFE_componentWillUpdate: function(nextProps, nextState) {
    if (this.state.loading !== nextState.loading && this.props.showInProgressAndUnstartedStudents) {
      this.props.showInProgressAndUnstartedStudents(!nextState.loading)
    }
  },

  disabled: function(){
    return this.props.premiumStatus === 'locked' || this.props.premiumStatus === 'none';
  },

  strippedResults: function(results) {
    return results.map((r) => {
      if(r.prompt) {
        r.prompt = stripHtml(r.prompt)
      }
      return r
    })
  },

  // Get results with all filters, sorting
  getFilteredResults: function() {
    let allResults = this.state.results;
    return this.applySorting(allResults);
  },

  // Get results after pagination has been applied.
  getVisibleResults: function(filteredResults) {
    return filteredResults;
  },

  goToPage: function(page) {
    let newState = {
      currentPage: page
    };
    this.setState(newState, this.fetchData);
  },

  resetPagination: function(next) {
    this.setState({
      currentPage: 1
    }, next);
  },

  // Filter sessions based on the classroom ID.
  selectClassroom: function(classroom) {
    this.setState({selectedClassroom: classroom})
    this.filterByField('classroom_id', classroom.value, this.onFilterChange);
  },

  // Filter sessions based on the student ID
  selectStudent: function(student) {
    this.setState({selectedStudent: student})
    this.filterByField('student_id', student.value, this.onFilterChange);
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unit) {
    this.setState({selectedUnit: unit})
    this.filterByField('unit_id', unit.value, this.onFilterChange);
  },

  onFilterChange: function() {
    if (this.props.pagination) {
      this.resetPagination(this.fetchData);
    } else {
      this.fetchData();
    }
  },

  requestParams: function() {
    let requestParams = _.extend(this.state.currentFilters, {});
    if (this.props.pagination) {
      requestParams = _.extend(requestParams, {page: this.state.currentPage});
    }
    requestParams['sort'] = this.state.currentSort;
    return requestParams;
  },

  fetchData: function(setStateBasedOnURLParams) {
    this.setState({loading: true});
    $.get(this.props.sourceUrl, this.requestParams(), function onSuccess(data) {
      this.setState({
        activityClassification: data.classification,
        numPages: data.page_count,
        loading: false,
        results: this.strippedResults(data[this.props.jsonResultsKey]),
        teacher: data.teacher,
        classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
        studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
        unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Activity Packs')
      });
      if (data.classification === EVIDENCE_KEY) this.setState({
        currentSort: {direction: 'asc', field: 'question_id'}
      })
      if (setStateBasedOnURLParams) {
        const classroomId = getParameterByName('classroom_id') || '';
        const studentId = getParameterByName('student_id') || '';
        const unitId = getParameterByName('unit_id') || '';
        const selectedClassroom = this.state.classroomFilters.filter(classroom => { return classroom.value == classroomId })[0];
        const selectedStudent = this.state.studentFilters.filter(student => { return student.value == studentId })[0];
        const selectedUnit = this.state.unitFilters.filter(unit => { return unit.value == unitId })[0];
        this.setState({
          selectedClassroom: selectedClassroom,
          selectedStudent: selectedStudent,
          selectedUnit: selectedUnit
        });
        this.filterByField('classroom_id', classroomId);
        this.filterByField('student_id', studentId);
        this.filterByField('unit_id', unitId);
        this.resetPagination();
        this.fetchData();
      }
      if (this.props.onFetchSuccess) {
        this.props.onFetchSuccess(data);
      }
    }.bind(this)).fail((e) => {
      // to do, use Sentry to capture error
    });
  },

  // Depending upon whether or not pagination is implemented,
  // sort results client-side or fetch sorted data from server.
  handleSort: function() {
    let cb;
    if (this.props.pagination) {
      cb = this.fetchData;
    } else {
      cb = _.noop;
    }
    return _.bind(this.sortResults, this, cb);
  },

  blur: function() {
    if (this.state.disabled) {
      return 'none';
    }
  },

  studentPageBlur: function() {
    const lastEightCharOfURL = window.location.href.substr(window.location.href.length - 8)
    const onStudentPage = lastEightCharOfURL == 'concepts'
    if (this.state.disabled && onStudentPage) {
      return 'non-premium-student'
    }
  },

  render: function() {
    let pagination,
      csvExport,
      mainSection,
      faqLink;
    let filteredResults = this.getFilteredResults();
    let visibleResults = this.getVisibleResults(filteredResults);

    if (this.props.exportCsv) {
      csvExport = <ExportCsv disabled={!!this.state.disabled} exportType={this.props.exportCsv} filters={this.state.currentFilters} reportUrl={this.props.sourceUrl} teacher={this.state.teacher} />;
    }
    if (this.state.loading) {
      mainSection = <LoadingIndicator />;
    } else {
      mainSection = <SortableTable colorByScoreKeys={this.props.colorByScoreKeys} columns={this.props.columnDefinitions(this.state.activityClassification)} currentSort={this.state.currentSort} onNonPremiumStudentPage={this.studentPageBlur()} rows={visibleResults} sortHandler={this.handleSort()} />;
    }
    if (!this.props.hideFaqLink) {
      faqLink = <FaqLink />
    }


    return (
      <div className={'premium-status-' + this.blur()}>
        <div className="row">
          <div className={'col-md-8 header-section ' + this.studentPageBlur()}>
            {this.props.children}
          </div>
          <div className="col-md-3 col-md-offset-1">
            {csvExport}
            {faqLink}
          </div>
        </div>
        <ProgressReportFilters classroomFilters={this.state.classroomFilters} filterTypes={this.props.filterTypes} selectClassroom={this.selectClassroom} selectedClassroom={this.state.selectedClassroom} selectedStudent={this.state.selectedStudent} selectedUnit={this.state.selectedUnit} selectStudent={this.selectStudent} selectUnit={this.selectUnit} studentFilters={this.state.studentFilters} unitFilters={this.state.unitFilters} />
        {mainSection}
        {pagination}
      </div>
    );
  },
});
