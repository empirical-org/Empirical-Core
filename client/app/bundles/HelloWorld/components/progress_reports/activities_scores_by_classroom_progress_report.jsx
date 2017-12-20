import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ClassroomDropdown from '../general_components/dropdown_selectors/classroom_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import {sortInnerLinkTextByLastNameForReactTableCell} from '../../../../modules/sortingMethods.js'
import moment from 'moment'

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
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/activities_scores_by_classroom_data`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = this.formatDataForCSV(data)
      const classroomsData = this.formatClassroomsData(data)
      // gets unique classroom names
      const classroomNames = [...new Set(classroomsData.map(row => row.classroom_name))]
      classroomNames.unshift(showAllClassroomKey)
      that.setState({loading: false, errors: body.errors, classroomsData, csvData, classroomNames});
    });
  }

  formatClassroomsData(data) {
    return data.map((row) => {
      row.name = <span className='green-text'>{row.name}</span>
      row.average_score = `${Math.round(parseFloat(row.average_score) * 100)}%`
      row.activity_count = Number(row.activity_count)
      row.green_arrow = (
        <a className='green-arrow' href={`/teachers/progress_reports/student_overview?classroom_id=${row.classroom_id}&student_id=${row.student_id}`}>
          <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
        </a>
      )
      row.nameUrl = <a href={`/teachers/progress_reports/student_overview?classroom_id=${row.classroom_id}&student_id=${row.student_id}`}>{row.name}</a>
      return row
    })
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Classroom Name', 'Student Name', 'Average Score', 'Activity Count']
    ]
    data.forEach((row) => {
      csvData.push([
        row['classroom_name'], row['name'], row['average_score'] * 100,
        row['activity_count']
      ])
    })
    return csvData
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'nameUrl',
        resizable: false,
        sortMethod: sortInnerLinkTextByLastNameForReactTableCell,
        Cell: props => props.value
      }, {
        Header: "Activities Completed",
        accessor: 'activity_count',
        resizable: false
      }, {
        Header: "Overall Score",
        accessor: 'average_score',
        resizable: false,
        sortMethod: (a, b) => {
          return Number(a.substr(0, a.indexOf('%'))) > Number(b.substr(0, b.indexOf('%')))
            ? 1
            : -1;
        }
      }, {
				Header: "Last Active",
				accessor: 'last_active',
				resizable: false,
				Cell: props => props.value ? moment(props.value).format("MM/DD/YYYY") : '',
				sortMethod: (a,b) => {
					const aEpoch = a ? moment(a).unix() : 0;
					const bEpoch = b ? moment(b).unix() : 0;
					return aEpoch > bEpoch ? 1 : -1;
				}
			},
			{
        Header: "Class",
        accessor: 'classroom_name',
        resizable: false
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        className: 'hi',
        width: 80,
        Cell: props => props.value
      }
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom})
  }

  filteredClassroomsData() {
    if (this.state.selectedClassroom === showAllClassroomKey) {
      return this.state.classroomsData
    }
    return this.state.classroomsData.filter((row) => row.classroom_name === this.state.selectedClassroom)
  }

  render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <LoadingSpinner/>
    }
    const filteredClassroomsData = this.filteredClassroomsData()
    return (
      <div className='activities-scores-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Activity Scores</h1>
            <p>View the overall average score for each student in an active classroom. Click on an individual student to view their scores by activity pack and activity.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ClassroomDropdown classrooms={this.state.classroomNames} callback={this.switchClassrooms} selectedClassroom={this.state.selectedClassroom}/>
        </div>
				<div key={`${filteredClassroomsData.length}-length-for-activities-scores-by-classroom`}>
					<ReactTable data={filteredClassroomsData}
						columns={this.columns()}
						showPagination={false}
						defaultSorted={[{id: 'last_active', desc: true}]}
					  showPaginationTop={false}
						showPaginationBottom={false}
						showPageSizeOptions={false}
						defaultPageSize={filteredClassroomsData.length}
						className='progress-report has-green-arrow'/></div>
      </div>
    )
  }

}
