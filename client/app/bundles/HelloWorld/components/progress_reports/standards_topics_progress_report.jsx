import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import moment from 'moment'
import userIsPremium from '../modules/user_is_premium'

import _ from 'underscore'

export default class extends React.Component {

  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
      userIsPremium: userIsPremium()
    }
    this.switchClassrooms = this.switchClassrooms.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`
    }, (e, r, body) => {
      const data = JSON.parse(body).topics
      const csvData = this.formatDataForCSV(data)
      const standardsData = this.formatStandardsData(data)
      // gets unique classroom names
      that.setState({loading: false, errors: body.errors, standardsData, csvData, student: JSON.parse(body).student});
    });
  }

  formatStandardsData(data) {
    return data.map((row) => {
      row.standard_level = <span className='green-text'>{row.name}</span>
      row.standard_name = row.section_name
      row.activities = Number(row.total_activity_count)
      row.average_score = Number(row.average_score * 100)
      row.mastery_status = row.mastery_status
      row.green_arrow = (
        <a className='green-arrow' href={`/teachers/progress_reports/standards/classrooms/0/topics/${row.id}/students`}>
          <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
        </a>
      )
      return row
    })
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Standard Level', 'Standard Name', 'Activities', 'Average', 'Proficiency Status']
    ]
    data.forEach((row) => {
      csvData.push([
        row['section_name'], row['name'], row['total_activity_count'], `${row['average_score']}%`, row['mastery_status']
      ])
    })
    return csvData
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Standard Level',
        accessor: 'standard_level',
        resizable: false,
      }, {
        Header: "Standard Name",
        accessor: 'standard_name',
        resizable: false
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        resizable: false
      }, {
        Header: 'Average',
        accessor: 'average_score',
        className: blurIfNotPremium,
        resizable: false,
        Cell: row => (
          `${row.original['average_score']}%`
        )
      }, {
        Header: 'Proficiency Status',
        accessor: 'mastery_status',
        className: blurIfNotPremium,
        resizable: false,
        Cell: row => (
          <span><span className={row.original['mastery_status'] === 'Proficient' ? 'proficient-indicator' : 'not-proficient-indicator'}/>{row.original['mastery_status']}</span>
        )
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        width: 80
      }
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom}, () => this.getData())
  }

  filteredData() {
    return this.state.standardsData
  }

  render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <LoadingSpinner/>
    }
    const filteredData = this.filteredData()
    return (
      <div className='individual-student progress-reports-2018 '>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1><span>Standards Report:</span> {this.state.student.name}</h1>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
				<div key={`${filteredData.length}-length-for-activities-scores-by-classroom`}>
					<ReactTable data={filteredData}
						columns={this.columns()}
						showPagination={false}
						defaultSorted={[{id: 'standard_level', desc: true}]}
					  showPaginationTop={false}
						showPaginationBottom={false}
						showPageSizeOptions={false}
						defaultPageSize={filteredData.length}
						className='progress-report has-green-arrow'/></div>
      </div>
    )
  }

}
