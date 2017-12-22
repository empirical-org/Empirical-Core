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

const showAllClassroomKey = 'All Classrooms'
const showAllStudentsKey = 'All Students'

export default class extends React.Component {

  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey,
      classrooms: [],
      userIsPremium: userIsPremium()
    }
    this.switchClassrooms = this.switchClassrooms.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const that = this;
    let qs
    if (this.state.selectedClassroom !== showAllClassroomKey) {
      const classroom = this.state.classrooms.find(c => c.name === this.state.selectedClassroom)
      qs = classroom ? {classroom_id: classroom.id} : null
    }
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/progress_reports/standards/classrooms.json`, qs
    }, (e, r, body) => {
      const data = JSON.parse(body).data
      console.log(data)
        const csvData = this.formatDataForCSV(data)
      const standardsData = this.formatStandardsData(data)
      // gets unique classroom names
      const classrooms = JSON.parse(body).classrooms
      const students = [...new Set(JSON.parse(body).students)]
      classrooms.unshift({name: showAllClassroomKey})
      students.unshift({name: showAllStudentsKey})
      that.setState({loading: false, errors: body.errors, standardsData, csvData, classrooms, students});
    });
  }

  formatStandardsData(data) {
    return data.map((row) => {
      row.standard_level = <span className='green-text'>{row.name}</span>
      row.standard_name = row.section_name
      row.number_of_students = Number(row.total_student_count)
      row.proficient = `${row.proficient_count} of ${row.total_student_count}`
      row.activities = Number(row.total_activity_count)
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
      ['Standard Level', 'Standard Name', 'Students', 'Proficient', 'Activities']
    ]
    data.forEach((row) => {
      csvData.push([
        row['section_name'], row['name'], row['total_student_count'], `${row['proficient_count']} of ${row['total_student_count']}`, row['total_activity_count']
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
        Header: "Students",
        accessor: 'number_of_students',
        resizable: false,
        }, {
				Header: "Proficient",
				accessor: 'proficient',
				resizable: false,
        className: blurIfNotPremium
				}, {
				Header: "Activities",
				accessor: 'activities',
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
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom}, () => this.getData())
  }

  goToStudentPage(student) {
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
      <div className='activities-scores-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Standards Report</h1>
            <p>Filter by classroom and student to see student mastery on the Common Core standards. You can export the data by downloading a CSV report.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ItemDropdown items={this.state.classrooms.map(c => c.name)} callback={this.switchClassrooms} selectedItem={this.state.selectedClassroom}/>
          <ItemDropdown style={{marginLeft: '20px'}} items={this.state.students.map(s => s.name)} callback={this.goToStudentPage}/>
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
