import React from 'react'
import request from 'request'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sortByLastName, sortFromSQLTimeStamp } from '../../../../modules/sortingMethods.js'
import moment from 'moment'
import EmptyStateForReport from './empty_state_for_report'

import _ from 'underscore'

const showAllClassroomKey = 'All Classrooms'

export default class extends React.Component {

  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey
    }
    this.switchClassrooms = this.switchClassrooms.bind(this)
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_concept_reports`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = this.formatDataForCSV(data)
      const conceptReportsData = data;
      // gets unique classroom names
      const classroomNames = [...new Set(conceptReportsData.map(row => row.classroom_name))]
      classroomNames.unshift(showAllClassroomKey)
      that.setState({loading: false, errors: body.errors, conceptReportsData, csvData, classroomNames});
    });
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Student', 'Teacher', 'Classroom', 'School', 'Correct', 'Incorrect', 'Success Rate']
    ]
    data.forEach((row) => {
      csvData.push([
        row['student_name'], row['teacher_name'], row['classroom_name'], row['school_name'],
        row['correct'], row['incorrect'], row['percentage']
      ])
    })
    return csvData
  }

  columns() {
    return ([
    {
      Header: 'Student',
      accessor: 'student_name',
      resizable: false,
      sortMethod: sortByLastName,
      Cell: row => row.original.student_name,
    }, {
      Header: 'Teacher',
      accessor: 'teacher_name',
      resizable: false,
      Cell: row => row.original.teacher_name,
    }, {
      Header: 'Classroom',
      accessor: 'classroom_name',
      resizable: false,
      Cell: row => row.original.classroom_name,
    }, {
      Header: 'School',
      accessor: 'school_name',
      resizable: false,
      Cell: row => row.original.school_name,
    }, {
      Header: 'Correct',
      accessor: 'correct',
      resizable: false,
      Cell: row => Number(row.original.correct),
    }, {
      Header: 'Incorrect',
      accessor: 'incorrect',
      resizable: false,
      Cell: row => Number(row.original.incorrect),
    }, {
      Header: 'Success Rate',
      accessor: 'percentage',
      resizable: false,
      Cell: row => Number(row.original.percentage),
    },
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom})
  }

  filteredConceptReportsData() {
    if (this.state.selectedClassroom === showAllClassroomKey) {
      return this.state.conceptReportsData
    }
    return this.state.conceptReportsData.filter((row) => row.classroom_name === this.state.selectedClassroom)
  }

  tableOrEmptyMessage(filteredClassroomsData){
    if (filteredClassroomsData.length) {
      return (<div key={`${filteredConceptReportsData.length}-length-for-concept-reports-by-classroom`}>
        <ReactTable data={filteredConceptReportsData}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{id: 'last_active', desc: true}]}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={filteredConceptReportsData.length}
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
    const filteredConceptReportsData = this.filteredConceptReportsData()
    return (
      <div className='concept-reports-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>District Concept Reports</h1>
            <p>View concept reports</p>
            <!-- TODO: what should the above text really be? -->
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ItemDropdown items={this.state.classroomNames} callback={this.switchClassrooms} selectedItem={this.state.selectedClassroom}/>
        </div>
        {this.tableOrEmptyMessage(filteredClassroomsData)}
      </div>
    )
  }
}
