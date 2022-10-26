import React from 'react'
import createReactClass from 'create-react-class';
import moment from 'moment'
import queryString from 'query-string'

import ProgressReportFilters from './progress_report_filters.jsx'
import EmptyStateForReport from './empty_state_for_report.jsx'
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import TableFilterMixin from '../general_components/table/sortable_table/table_filter_mixin'
import { getTimeSpent } from '../../helpers/studentReports';
import { ReactTable, } from '../../../Shared/index'
import { requestGet, } from '../../../../modules/request/index'


export default createReactClass({
  displayName: 'activities_progress_report',

  mixins: [TableFilterMixin],

  getInitialState: function() {
    return {
      loadingFilterOptions: true,
      currentPage: 0,
      csvData: [],
      currentSort: {sort_param: 'completed_at', sort_descending: true},
      premium: false
    }
  },

  componentDidMount: function() {
    this.fetchData();
  },

  requestParams: function() {
    const { currentPage, currentFilters, currentSort, filtersLoaded, } = this.state
    let params = Object.assign({},
      { page: currentPage + 1 },
      currentFilters,
      currentSort
    );

    if(filtersLoaded) {
      params = Object.assign(params, {without_filters: true});
    }

    return params;
  },

  fetchData: function() {
    const { filtersLoaded, } = this.state
    this.setState({ loadingNewTableData: true });
    requestGet(
      queryString.stringifyUrl({ url: `${process.env.DEFAULT_URL}/teachers/progress_reports/activity_sessions.json`, query: this.requestParams()}),
      (body) => {
        const data = JSON.parse(body);

        const classroomFilters = this.getFilterOptions(data.classrooms, 'name', 'id', 'All classes')
        const studentFilters = this.getFilterOptions(data.students, 'name', 'id', 'All students')
        const unitFilters = this.getFilterOptions(data.units, 'name', 'id', 'All activity packs')

        const selectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)

        if (!filtersLoaded && selectedClassroomId && classroomFilters.find(c => Number(c.value) === Number(selectedClassroomId))) {
          const newState = {
            classroomFilters,
            studentFilters,
            unitFilters,
            filtersLoaded: true,
            currentFilters: { classroom_id: Number(selectedClassroomId), }
          }
          this.setState(newState, () => this.fetchData())
        } else {
          let newState = {
            loadingFilterOptions: false,
            loadingNewTableData: false,
            results: data.activity_sessions,
            numPages: data.page_count,
            classroomFilters,
            studentFilters,
            unitFilters,
          };

          if (!filtersLoaded) {
            newState = Object.assign(newState, {
              filtersLoaded: true
            })
          }

          this.setState(newState, () => {
            const { classroomFilters, selectedStudent, studentFilters, selectedUnit, unitFilters, } = this.state
            const selectedClassroom = classroomFilters.find(c => Number(c.value) === Number(selectedClassroomId)) || classroomFilters[0]
            this.setState({
              selectedClassroom,
              selectedStudent: selectedStudent || studentFilters[0],
              selectedUnit: selectedUnit || unitFilters[0]
            })
          });
        }
      }
    );
  },

  canViewReport: function() {
    const { premiumStatus, } = this.props
    return premiumStatus === 'paid' || premiumStatus === 'trial'
  },

  columnDefinitions: function() {
    const { studentFilters, } = this.state
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Student',
        accessor: 'student_id',
        resizeable: false,
        Cell: ({row}) => studentFilters.find(student => student.value == row.original.student_id)?.name,
        className: this.nonPremiumBlur(),
        maxWidth: 200
      },
      {
        Header: 'Date',
        accessor: 'completed_at',
        resizeable: false,
        Cell: ({row}) => moment.unix(Number(row.original.completed_at)).format('M/D/YY'),
        maxWidth: 90
      },
      {
        Header: 'Activity',
        accessor: 'activity_name',
        resizeable: false,
        className: 'show-overflow'
      },
      {
        Header: 'Score',
        accessor: 'percentage',
        resizeable: false,
        Cell: ({row}) => row.original.percentage >= 0 ? `${Math.round(row.original.percentage * 100)}%` : 'Completed',
        className: this.nonPremiumBlur(),
        maxWidth: 90
      },
      {
        Header: 'Time spent',
        accessor: 'timespent',
        resizeable: false,
        Cell: ({row}) => getTimeSpent(row.original.timespent),
        className: this.nonPremiumBlur(),
        maxWidth: 90
      },
      {
        Header: 'Standard',
        accessor: 'standard',
        resizeable: false,
        Cell: ({row}) => row.original.standard ? row.original.standard.split(' ')[0] : '',
        maxWidth: 90
      },
      {
        Header: 'Tool',
        accessor: 'activity_classification_name',
        resizeable: false,
        maxWidth: 150
      }
    ];
  },

  selectClassroom: function(classroom) {
    this.setState({ selectedClassroom: classroom, });
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.value)
    this.filterByField('classroom_id', classroom.value, this.onFilterChange);
  },

  selectStudent: function(student) {
    this.setState({ selectedStudent: student, });
    this.filterByField('student_id', student.value, this.onFilterChange);
  },

  selectUnit: function(unit) {
    this.setState({ selectedUnit: unit, });
    this.filterByField('unit_id', unit.value, this.onFilterChange);
  },

  onFilterChange: function() {
    this.setState({loading: true, currentPage: 0}, this.fetchData);
  },

  reactTableSortedChange: function(state, instance) {
    if (!state.length) { return }
    const { currentSort, } = this.state
    const newSort = {
      sort_param: state[0].id,
      sort_descending: state[0].desc,
    }

    if (_.isEqual(currentSort, newSort)) { return }

    this.setState({
      // We want to revert to the first page if changing anything other than the page.
      currentPage: 0,
      currentSort: {
        sort_param: state[0].id,
        sort_descending: state[0].desc,
      }
    }, this.fetchData);
  },

  reactTablePageChange: function(newPage) {
    const { currentPage, } = this.state
    if (currentPage === newPage) { return }
    this.setState({
      currentPage: newPage,
    }, this.fetchData);
  },

  tableOrEmptyMessage: function(){
    const {
      results,
      loadingNewTableData,
      currentPage,
      numPages,
      classroomFilters,
      selectedClassroom,
      selectedStudent,
      selectedUnit,
      studentFilters,
      unitFilters,
      currentSort,
    } = this.state
    let tableOrEmptyMessage
    if (results.length) {
      tableOrEmptyMessage = (<ReactTable
        className='progress-report'
        columns={this.columnDefinitions()}
        currentPage={currentPage}
        data={results}
        defaultPageSize={Math.min(results.length, 25)}
        defaultSorted={[{id: currentSort.sort_param, desc: currentSort.sort_descending}]}
        loading={loadingNewTableData}
        manualPageCount={numPages}
        manualPagination={true}
        manualSortBy={true}
        onPageChange={this.reactTablePageChange}
        onSortedChange={this.reactTableSortedChange}
        resizable={false}
        showPageSizeOptions={false}
        showPagination={true}
        showPaginationBottom={true}
        showPaginationTop={false}
      />)
    } else {
      tableOrEmptyMessage = <EmptyStateForReport />
    }
    return (
      <div>
        <ProgressReportFilters
          classroomFilters={classroomFilters}
          filterTypes={['unit', 'classroom', 'student']}
          selectClassroom={this.selectClassroom}
          selectedClassroom={selectedClassroom}
          selectedStudent={selectedStudent}
          selectedUnit={selectedUnit}
          selectStudent={this.selectStudent}
          selectUnit={this.selectUnit}
          studentFilters={studentFilters}
          unitFilters={unitFilters}
        />
        {tableOrEmptyMessage}
      </div>
    )
  },

  renderFiltersAndTable: function() {
    const { loadingFilterOptions, loadingNewTableData, } = this.state
    if(loadingFilterOptions || loadingNewTableData) {
      return <LoadingSpinner />
    }
    return (this.tableOrEmptyMessage())
  },

  paramsToQueryString: function(){
    // converts the params object to a query string
    // https://stackoverflow.com/a/35416293/2812720
    const obj = this.requestParams()
    return `?${Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')}`;
  },

  nonPremiumBlur: function() {
    return this.canViewReport() ? '' : 'non-premium-blur';
  },

  downloadReport: function() {
    if(this.canViewReport()) {
      return window.open(`/teachers/progress_reports/activity_sessions.csv${this.paramsToQueryString()}`);
    }
    alert('Downloadable reports are a Premium feature. You can visit Quill.org/premium to upgrade now!');
  },

  render: function() {
    return (
      <div className='progress-reports-2018 data-export'>
        <div className='meta-overview flex-row space-between'>
          <div className='header-and-info'>
            <h1>Data Export</h1>
            <p>You can export the data as a CSV file by filtering for the classrooms, activity packs, or students you would like to export and then pressing "Download Report."</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <button className='quill-button medium primary contained focus-on-light' onClick={this.downloadReport} style={{display: 'block'}}>Download Report</button>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        {this.renderFiltersAndTable()}
      </div>
    );
  },
});
