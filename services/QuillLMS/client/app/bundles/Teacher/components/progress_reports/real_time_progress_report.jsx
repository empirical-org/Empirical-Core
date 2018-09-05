import React from 'react'
import request from 'request'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import _ from 'underscore';
import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sortByLastName } from '../../../../modules/sortingMethods.js'
import moment from 'moment'
import EmptyStateForReport from './empty_state_for_report'


export default class extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      errors: false,
    };
    this.initializePusher = this.initializePusher.bind(this);
    this.clearStudentData = this.clearStudentData.bind(this);
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/real_time_data`,
    }, (e, r, body) => {
      const data = JSON.parse(body).data;
      const studentsData = data;
      that.setState({ loading: false, errors: body.errors, studentsData, });
    });
    this.initializePusher();
  }

  clearStudentData() {
    const studentsData = { data: {}, };
    this.setState({ studentsData, });
  }

  initializePusher() {
    /* TODO */
    const { currentUser, } = this.props;
    const teacherId = currentUser.id;
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(teacherId.toString());
    const maxIntervalWithoutInteractionBeforeClearing = 30000;
    let clearStudentDataAfterPause = setTimeout(
      this.clearStudentData,
      maxIntervalWithoutInteractionBeforeClearing
    );
    channel.bind('as-interaction-log-pushed', (pushedData) => {
      // reset clock on table
      clearTimeout(clearStudentDataAfterPause);
      clearStudentDataAfterPause = setTimeout(
        this.clearStudentData,
        maxIntervalWithoutInteractionBeforeClearing
      );
      const studentsData = pushedData.data;
      this.setState({ studentsData, });
    });
  }

  humanTime(timeInSeconds) {
    let result = '';
    if (timeInSeconds / 60 > 1) {
      result += `${moment.duration(timeInSeconds / 60, 'minutes').humanize()} and `;
    }
    result += `${timeInSeconds % 60} seconds`;
    return result;
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (
          row.original.name
        ),
      }, {
        Header: 'Activity',
        accessor: 'activity_name',
        resizable: false,
        minWidth: 120,
        Cell: row => (
          row.original.activity_name
        ),
      }, {
        Header: 'Current Question',
        accessor: 'timespent_question',
        resizable: false,
        minWidth: 90,
        Cell: row => (
          this.humanTime(parseInt(row.original.timespent_question))
        ),
      }, {
        Header: 'Session Length',
        accessor: 'timespent_activity_session',
        resizable: false,
        minWidth: 90,
        Cell: row => (
          moment.duration(parseInt(row.original.timespent_activity_session), 'seconds').humanize()
        ),
      }
    ])
  }

  filteredStudentsData() {
    return this.state.studentsData
  }

  tableOrEmptyMessage(filteredStudentsData){
    if (filteredStudentsData.length) {
      return (<div key={`${filteredStudentsData.length}-length-for-real-time`}>
        <ReactTable data={filteredStudentsData}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{id: 'name', desc: true}]}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={filteredStudentsData.length}
          getTrProps={(state, rowInfo, column) => {
            return {
              style: {
                background: rowInfo.row.timespent_question > 90 ? '#ff7a7a' : 'inherit',
                color: rowInfo.row.timespent_question > 90 ? '#ffffff' : 'inherit',
              },
            };
          }}
          className='progress-report has-green-arrow'/>
        </div>)
    } else {
      return <EmptyStateForReport/>
    }
  }

  render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <LoadingSpinner/>
    }
    const filteredStudentsData = this.filteredStudentsData()
    return (
      <div className='real-time progress-reports-2018'>
        <div className='meta-overview flex-row space-between'>
          <div className='header-and-info'>
            <h1>
              Real-time
            </h1>
            <p></p>
          </div>
        </div>
        {this.tableOrEmptyMessage(filteredStudentsData)}
      </div>
    );
  }
}
