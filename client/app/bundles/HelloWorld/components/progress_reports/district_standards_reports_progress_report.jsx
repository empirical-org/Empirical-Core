import React from 'react'
import request from 'request'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sortFromSQLTimeStamp } from '../../../../modules/sortingMethods.js'
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
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_standards_reports`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = this.formatDataForCSV(data)
      const standardsReportsData = data;
      // gets unique classroom names
      const classroomNames = [...new Set(standardsReportsData.map(row => row.classroom_name))]
      classroomNames.unshift(showAllClassroomKey)
      that.setState({loading: false, errors: body.errors, standardsReportsData, csvData, classroomNames});
    });
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Standard Level', 'Standard Name', 'Students', 'Proficient', 'Activities']
    ]
    data.forEach((row) => {
      csvData.push([
        row['section_name'], row['name'], row['total_student_count'], row['proficient_count'], row['total_activity_count']
      ])
    })
    return csvData
  }

  columns() {
    return ([
    {
      Header: 'Standard Level',
      accessor: 'section_name',
      resizable: false,
      Cell: row => row.original.section_name,
    }, {
      Header: 'Standard Name',
      accessor: 'name',
      resizable: false,
      Cell: row => row.original.name,
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      resizable: false,
      Cell: row => Number(row.original.total_student_count),
    }, {
      Header: 'Proficient',
      accessor: 'proficient_count',
      resizable: false,
      Cell: row => Number(row.original.proficient_count),
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      Cell: row => Number(row.original.total_activity_count),
    },
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom})
  }

  filteredStandardsReportsData() {
    if (this.state.selectedClassroom === showAllClassroomKey) {
      return this.state.standardsReportsData
    }
    return this.state.standardsReportsData.filter((row) => row.classroom_name === this.state.selectedClassroom)
  }

  tableOrEmptyMessage(filteredClassroomsData){
    if (filteredClassroomsData.length) {
      return (<div key={`${filteredStandardsReportsData.length}-length-for-standards-reports-by-classroom`}>
        <ReactTable data={filteredStandardsReportsData}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{id: 'last_active', desc: true}]}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={filteredStandardsReportsData.length}
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
    const filteredStandardsReportsData = this.filteredStandardsReportsData()
    return (
      <div className='standards-reports-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>District Standards Reports</h1>
            <p>View standards reports</p>
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
