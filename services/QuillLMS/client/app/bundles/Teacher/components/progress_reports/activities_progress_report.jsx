import React from 'react'
import createReactClass from 'create-react-class';
import request from 'request'
import ReactTable from 'react-table'
import moment from 'moment'

import ProgressReportFilters from './progress_report_filters.jsx'

import 'react-table/react-table.css'
import EmptyStateForReport from './empty_state_for_report.jsx'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import TableFilterMixin from '../general_components/table/sortable_table/table_filter_mixin'

export default createReactClass({
  displayName: 'activities_progress_report',

  mixins: [TableFilterMixin],

  getInitialState: function() {
    return {
      loadingFilterOptions: true,
      currentPage: 0,
      csvData: [],
      currentSort: {},
      premium: false
    }
  },

  componentDidMount: function() {
    this.fetchData();
  },

  requestParams: function() {
    let params = Object.assign({},
      { page: this.state.currentPage + 1 },
      this.state.currentFilters,
      this.state.currentSort
    );

    if(this.state.filtersLoaded) {
      params = Object.assign(params, {without_filters: true});
    }

    return params;
  },

  fetchData: function() {
    this.setState({ loadingNewTableData: true });
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/progress_reports/activity_sessions.json`,
      qs: this.requestParams()
    }, (e, r, body) => {
      const data = JSON.parse(body);
      let newState = {
        loadingFilterOptions: false,
        loadingNewTableData: false,
        results: data.activity_sessions,
        numPages: data.page_count,
      };

      if(!this.state.filtersLoaded) {
        newState = Object.assign(newState, {
          classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classes'),
          studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
          unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Activity Packs'),
          filtersLoaded: true
        });
      }

      that.setState(newState, () => {
        this.setState({
          selectedClassroom: this.state.selectedClassroom || this.state.classroomFilters[0],
          selectedStudent: this.state.selectedStudent || this.state.studentFilters[0],
          selectedUnit: this.state.selectedUnit || this.state.unitFilters[0]
        })
      });
    });
  },

  canViewReport: function() {
    return this.props.premiumStatus === 'paid' || this.props.premiumStatus === 'trial'
  },

  columnDefinitions: function() {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Student',
        accessor: 'student_id',
        resizeable: false,
        Cell: props => this.state.studentFilters.find(student => student.value == props.value).name,
        className: this.nonPremiumBlur()
      },
      {
        Header: 'Date',
        accessor: 'completed_at',
        resizeable: false,
        Cell: props => moment.unix(Number(props.value)).format('M/D/YY'),
        maxWidth: 90
      },
      {
        Header: 'Activity',
        accessor: 'activity_name',
        resizeable: false,
        Cell: props => props.value
      },
      {
        Header: 'Score',
        accessor: 'percentage',
        resizeable: false,
        Cell: props => props.value >= 0 ? `${Math.round(props.value * 100)}%` : 'Completed',
        className: this.nonPremiumBlur(),
        maxWidth: 90
      },
      {
        Header: 'Standard',
        accessor: 'standard',
        resizeable: false,
        Cell: props => props.value.split(' ')[0],
        maxWidth: 90
      },
      {
        Header: 'Tool',
        accessor: 'activity_classification_name',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 150
      }
    ];
  },

  selectClassroom: function(classroom) {
    this.setState({ selectedClassroom: classroom, });
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
    this.setState({
      // We want to revert to the first page if changing anything other than the page.
      currentPage: 0,
      currentSort: {
        sort_param: state[0].id,
        sort_descending: state[0].desc,
      }
    }, this.fetchData);
  },

  reactTablePageChange: function(state, instance) {
    this.setState({
      currentPage: state,
    }, this.fetchData);
  },

  tableOrEmptyMessage: function(){
    let tableOrEmptyMessage
    if (this.state.results.length) {
      tableOrEmptyMessage = (<ReactTable
        className='progress-report'
        columns={this.columnDefinitions()}
        data={this.state.results}
        defaultPageSize={Math.min(this.state.results.length, 25)}
        defaultSorted={[{id: 'completed_at', desc: true}]}
        loading={this.state.loadingNewTableData}
        manual={true}
        onPageChange={this.reactTablePageChange}
        onSortedChange={this.reactTableSortedChange}
        page={this.state.currentPage}
        pages={this.state.numPages}
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
            classroomFilters={this.state.classroomFilters}
            filterTypes={['unit', 'classroom', 'student']}
            selectClassroom={this.selectClassroom}
            selectedClassroom={this.state.selectedClassroom}
            selectedStudent={this.state.selectedStudent}
            selectedUnit={this.state.selectedUnit}
            selectStudent={this.selectStudent}
            selectUnit={this.selectUnit}
            studentFilters={this.state.studentFilters}
            unitFilters={this.state.unitFilters}
          />
          {tableOrEmptyMessage}
        </div>
      )
  },

  renderFiltersAndTable: function() {
    if(this.state.loadingFilterOptions) {
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
      <div className='progress-reports-2018'>
        <div className='meta-overview flex-row space-between'>
          <div className='header-and-info'>
            <h1>Data Export</h1>
            <p>You can export the data as a CSV file by filtering for the classrooms, activity packs, or students you would like to export and then pressing "Download Report."</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <button className='btn button-green' onClick={this.downloadReport} style={{display: 'block'}}>Download Report</button>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        {this.renderFiltersAndTable()}
      </div>
    );
  },
});
