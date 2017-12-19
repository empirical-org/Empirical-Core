import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ClassroomDropdown from '../general_components/dropdown_selectors/classroom_dropdown'

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
			const classroomNames = [...new Set(classroomsData.map(row=>row.classroom_name))]
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

	sortByLastName(name1, name2) {
    // using props.children because we have react elements being passed
    // rather than straight names due to us having styled them
		const lastName1 = _.last(name1.props.children.props.children.split(' '))
		const lastName2 = _.last(name2.props.children.props.children.split(' '))
		return lastName1 > lastName2 ? 1 : -1
	}

  columns() {
    return (
		 [
				{
					Header: 'Student',
					accessor: 'nameUrl',
					resizable: false,
					sortMethod: this.sortByLastName,
					Cell: props => props.value
				}, {
					Header: "Activities Completed",
					accessor: 'activity_count',
					resizable: false,
				}, {
					Header: "Overall Score",
					accessor: 'average_score',
					resizable: false,
					sortMethod: (a,b) => {
						return Number(a.substr(0, a.indexOf('%'))) > Number(b.substr(0, b.indexOf('%'))) ? 1 : -1;
					}
				}, {
					Header: "Class",
					accessor: 'classroom_name',
					resizable: false,
				}, {
					Header: "",
					accessor: 'green_arrow',
					resizable: false,
					sortable: false,
					className: 'hi',
					width: 80,
					Cell: props => props.value
				}
			]
		)
  }

	switchClassrooms(classroom){
		this.setState({selectedClassroom: classroom})
	}

	filteredClassroomsData(){
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
      return <div>LOADING</div>
    }
		const filteredClassroomsData = this.filteredClassroomsData()
    return (
      <div className='activities-scores-by-classroom progress-reports-2018'>
        <CSVLink data={this.state.csvData} target="_blank">Link Report</CSVLink>
				<div className="activity-scores-overview flex-row space-between">
					<div className='header-and-info'>
						<h1>Activity Scores</h1>
						<p>View the overall average score for each student in an active classroom. Click on an individual student to view their scores by activity pack and activity.</p>
					</div>
					<div className='csv-and-how-we-grade'>
						<CSVLink data={this.state.csvData} target="_blank"><button className='btn button-green'>Download Report</button></CSVLink>
						<a href="/">How We Grade <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
					</div>
				</div>
				<div className='dropdown-container'>
					<ClassroomDropdown
							classrooms={this.state.classroomNames}
							callback={this.switchClassrooms}
							selectedClassroom={this.state.selectedClassroom}
						/>
				</div>
        <ReactTable
					data={filteredClassroomsData}
					columns={this.columns()}
					showPagination= {false}
  				showPaginationTop= {false}
  				showPaginationBottom= {false}
  				showPageSizeOptions= {false}
					defaultPageSize={filteredClassroomsData.length}
					className='progress-report has-green-arrow'
					/>
      </div>
    )
  }

}
