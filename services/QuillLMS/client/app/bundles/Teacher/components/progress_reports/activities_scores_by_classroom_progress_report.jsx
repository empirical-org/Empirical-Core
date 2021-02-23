import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import _ from 'underscore'
import queryString from 'query-string';

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import {sortByLastName, sortFromSQLTimeStamp} from '../../../../modules/sortingMethods.js'
import moment from 'moment'
import EmptyStateForReport from './empty_state_for_report'

const showAllClassroomKey = 'All Classrooms'

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey
    }
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/activities_scores_by_classroom_data`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const classroomsData = data;
      // gets unique classroom names
      const classroomNames = Array.from(new Set(classroomsData.map(row => row.classroom_name)))
      classroomNames.unshift(showAllClassroomKey)

      const newState = {loading: false, errors: body.errors, classroomsData, classroomNames}
      const selectedClassroomId = queryString.parse(window.location.search).classroom_id

      if (selectedClassroomId) {
        const selectedClassroom = classroomsData.find(c => Number(c.classroom_id) === Number(selectedClassroomId))
        newState.selectedClassroom = selectedClassroom.classroom_name || showAllClassroomKey
      }
      that.setState(newState);
    });
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`} style={{color: '#00c2a2'}}>
          {row.original.name}
        </a>),
      }, {
        Header: "Activities Completed",
        accessor: 'activity_count',
        resizable: false,
        minWidth: 120,
        Cell: row => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {Number(row.original.activity_count)}
        </a>),
      }, {
        Header: "Overall Score",
        accessor: 'average_score',
        resizable: false,
        minWidth: 90,
        Cell: row => {
          const value = Math.round(parseFloat(row.original.average_score) * 100);
          return (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
            {isNaN(value) ? '--' : value + '%'}
          </a>)
        }
      }, {
				Header: "Last Active",
				accessor: 'last_active',
				resizable: false,
        minWidth: 90,
        Cell: row => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {row.original.last_active ? moment(row.original.last_active).format("MM/DD/YYYY") : <span />}
        </a>),
				sortMethod: sortFromSQLTimeStamp,
			},
			{
        Header: "Class",
        accessor: 'classroom_name',
        resizable: false,
        Cell: row => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {row.original.classroom_name}
        </a>)
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        width: 80,
        Cell: row => (
          <a className='green-arrow' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
            <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
          </a>
        )
      }
    ])
  }

  filteredClassroomsData() {
    if (this.state.selectedClassroom === showAllClassroomKey) {
      return this.state.classroomsData
    }
    return this.state.classroomsData.filter((row) => row.classroom_name === this.state.selectedClassroom)
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Classroom Name', 'Student Name', 'Average Score', 'Activity Count']
    ]
    data.forEach((row) => {
      csvData.push([
        row['classroom_name'], row['name'], (row['average_score'] * 100).toString() + '%',
        row['activity_count']
      ])
    })
    return csvData
  }

  switchClassrooms = classroom => {
    const { classroomsData, } = this.state
    const classroomRecord = classroomsData.find(c => c.classroom_name === classroom)
    if (classroomRecord) {
      window.history.pushState({}, '', `${window.location.pathname}?classroom_id=${classroomRecord.classroom_id}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
    this.setState({selectedClassroom: classroom})
  };

  tableOrEmptyMessage(filteredClassroomsData){
    if (filteredClassroomsData.length) {
      return (<div key={`${filteredClassroomsData.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          className='progress-report has-green-arrow'
          columns={this.columns()}
          data={filteredClassroomsData}
          defaultPageSize={filteredClassroomsData.length}
          defaultSorted={[{id: 'last_active', desc: true}]}
          showPageSizeOptions={false}
          showPagination={false}
          showPaginationBottom={false}
          showPaginationTop={false}
        />
      </div>)
    } else {
      return <EmptyStateForReport />
    }
  }

  render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <LoadingSpinner />
    }
    const filteredClassroomsData = this.filteredClassroomsData()
    return (
      <div className='activities-scores-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Activity Scores</h1>
            <p>View the overall average score for each student in an active classroom. Click on a student’s name to see a report of each individual activity and print it as a PDF. You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.formatDataForCSV(filteredClassroomsData)} key={`${this.state.selectedClassroom} report button`} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ItemDropdown callback={this.switchClassrooms} items={this.state.classroomNames} selectedItem={this.state.selectedClassroom} />
        </div>
        {this.tableOrEmptyMessage(filteredClassroomsData)}
      </div>
    )
  }
}
