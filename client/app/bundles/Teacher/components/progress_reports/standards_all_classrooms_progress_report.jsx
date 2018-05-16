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
import {sortByStandardLevel} from '../../../../modules/sortingMethods.js'
import EmptyStateForReport from './empty_state_for_report'

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
      updatingData: true,
      classrooms: [],
      userIsPremium: userIsPremium()
    }
    this.switchClassrooms = this.switchClassrooms.bind(this)
    this.goToStudentPage = this.goToStudentPage.bind(this)
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
      const standardsData = this.formatStandardsData(JSON.parse(body).data)
      // gets unique classroom names
      const classrooms = JSON.parse(body).classrooms
      const students = [...new Set(JSON.parse(body).students)]
      classrooms.unshift({name: showAllClassroomKey})
      students.unshift({name: showAllStudentsKey})
      that.setState({loading: false, updatingData: false, errors: body.errors, standardsData, classrooms, students});
    });
  }

  formatStandardsData(data) {
    const selectedClassroomId = this.state.selectedClassroom !== showAllClassroomKey ? this.state.classrooms.find(c => c.name === this.state.selectedClassroom).id : 0
    return data.map((row) => {
      row.standard_level = row.section_name
      row.standard_name = row.name
      row.number_of_students = Number(row.total_student_count)
      row.proficient = `${row.proficient_count} of ${row.total_student_count}`
      row.activities = Number(row.total_activity_count)
      row.green_arrow = (
        <a className='green-arrow' href={`/teachers/progress_reports/standards/classrooms/${selectedClassroomId}/topics/${row.id}/students`}>
          <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
        </a>
      )
      row.link = `/teachers/progress_reports/standards/classrooms/${selectedClassroomId}/topics/${row.id}/students`
      return row
    })
  }

  formatDataForCSV() {
    const csvData = [
      ['Standard Level', 'Standard Name', 'Students', 'Proficient', 'Activities']
    ]
    this.state.standardsData.forEach((row) => {
      csvData.push([
        row['section_name'], row['name'], row['total_student_count'], `${row['proficient_count']} of ${row['total_student_count']}`, row['total_activity_count']
      ])
    })
    return csvData
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    const selectedClassroomId = this.state.selectedClassroom !== showAllClassroomKey ? this.state.classrooms.find(c => c.name === this.state.selectedClassroom).id : 0
    return ([
      {
        Header: 'Standard Level',
        accessor: 'standard_level',
        sortMethod: sortByStandardLevel,
        resizable: false,
        width: 150,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} style={{width: '100%', display: 'inline-block'}}>
            {row.original['section_name']}
          </a>
        )
      }, {
        Header: "Standard Name",
        accessor: 'standard_name',
        sortMethod: sortByStandardLevel,
        resizable: false,
        minWidth: 300,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} className="row-link-disguise">
            {row.original['name']}
          </a>
        )
      }, {
        Header: "Students",
        accessor: 'number_of_students',
        resizable: false,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} className="row-link-disguise">
            {row.original['number_of_students']}
          </a>
        )
        }, {
				Header: "Proficient",
				accessor: 'proficient',
				resizable: false,
        className: blurIfNotPremium,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} className="row-link-disguise">
            {row.original['proficient']}
          </a>
        )
				}, {
				Header: "Activities",
				accessor: 'activities',
				resizable: false,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} className="row-link-disguise">
            {row.original['activities']}
          </a>
        )
				}, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        width: 80,
        Cell: props => props.value
      }
    ])
  }

  switchClassrooms(classroom) {
    this.setState({selectedClassroom: classroom, updatingData: true}, () => this.getData())
  }

  goToStudentPage(studentName) {
    const student = this.state.students.find(s => s.name === studentName)
    if (student) {
      window.location.href = `/teachers/progress_reports/standards/classrooms/0/students/${student.id}/topics`
    }
  }

  tableOrEmptyMessage(){
      const data = this.state.standardsData
      if (data.length) {
        return (
          <div key={`${data.length}-length-for-activities-scores-by-classroom`}>
  					<ReactTable data={data}
  						columns={this.columns()}
  						showPagination={false}
  						defaultSorted={[{id: 'standard_level', desc: false}]}
  					  showPaginationTop={false}
  						showPaginationBottom={false}
  						showPageSizeOptions={false}
  						defaultPageSize={data.length}
  						className='progress-report has-green-arrow'/></div>
        )
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
    return (
      <div className='standards-all-classrooms progress-reports-2018 '>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Standards Report</h1>
            <p>Filter by classroom and student to see student mastery on the Common Core standards. You can export the data by downloading a CSV report.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport key={`data is updating: ${this.state.updatingData}`} data={this.formatDataForCSV()}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ItemDropdown items={this.state.classrooms.map(c => c.name)} callback={this.switchClassrooms} selectedItem={this.state.selectedClassroom}/>
          <ItemDropdown items={_.uniq(this.state.students.map(s => s.name))} callback={this.goToStudentPage}/>
        </div>
        {this.tableOrEmptyMessage()}
      </div>
    )
  }

}
