import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import ReactTable from 'react-table'

import _ from 'underscore'

export default class extends React.Component {

  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false
    }
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/activities_scores_by_classroom_data`
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = this.formatDataForCSV(data)
      const classroomsData = this.formatClassroomsData(data)
      that.setState({loading: false, errors: body.errors, classroomsData, csvData});
    });
  }

  formatClassroomsData(data) {
    return data.map((row) => {
      row.average_score = `${Math.round(parseFloat(row.average_score) * 100)}%`
      row.green_arrow = (
        <a href={`/teachers/progress_reports/student_overview?classroom_id=${row.classroom_id}&student_id=${row.student_id}`}>
          <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
        </a>
      )
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
    return (
		 [
				{
					Header: 'Student',
					accessor: 'name'
				}, {
					Header: "Activities Completed",
					accessor: 'activity_count'
				}, {
					Header: "Overall Score",
					accessor: 'average_score'
				}, {
					Header: "Classroom",
					accessor: 'classroom_name'
				}, {
					Header: "",
					accessor: 'green_arrow',
					Cell: props => props.value
				}
			]
		)
  }

  render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <div>LOADING</div>
    }
    return (
      <div>
        <CSVLink data={this.state.csvData} target="_blank">Link Report</CSVLink>
        <ReactTable data={this.state.classroomsData} columns={this.columns()}/>
      </div>
    )
  }

}
