import React from 'react'
import request from 'request'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import {sortByLastName} from '../../../../modules/sortingMethods.js'
import moment from 'moment'
import EmptyStateForReport from './empty_state_for_report'

import _ from 'underscore'


export default class extends React.Component {

  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
    }
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/real_time_data`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const studentsData = data;
      that.setState({loading: false, errors: body.errors, studentsData});
    });
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (
          <a>{row.original.name}</a>
        ),
      }, {
        Header: 'Tool',
        accessor: 'tool',
        resizable: false,
        minWidth: 120,
        Cell: row => (
          <a>{row.original.tool}</a>
        ),
      }, {
        Header: 'Current Question',
        accessor: 'current_question_time',
        resizable: false,
        minWidth: 90,
        Cell: row => (
          <a>{row.original.current_question_time}</a>
        ),
      }, {
        Header: 'Session Length',
        accessor: 'session_time',
        resizable: false,
        minWidth: 90,
        Cell: row => (
          <a>{row.original.session_time}</a>
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
