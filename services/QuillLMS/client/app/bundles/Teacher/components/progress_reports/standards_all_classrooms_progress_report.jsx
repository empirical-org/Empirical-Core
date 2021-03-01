import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import queryString from 'query-string';

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


export default class StandardsAllClassroomsProgressReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      errors: false,
      selectedClassroomId: queryString.parse(window.location.search).classroom_id || showAllClassroomKey,
      updatingData: true,
      classrooms: [],
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { selectedClassroomId, } = this.state

    const that = this;
    let qs = null

    if (selectedClassroomId !== showAllClassroomKey) {
      qs = {classroom_id: selectedClassroomId}
    }
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/progress_reports/standards/classrooms.json`, qs
    }, (e, r, body) => {
      const standardsData = this.formatStandardsData(JSON.parse(body).data)
      // gets unique classroom names
      const classrooms = JSON.parse(body).classrooms
      const students = Array.from(new Set(JSON.parse(body).students))
      classrooms.unshift({name: showAllClassroomKey})
      students.unshift({name: showAllStudentsKey})
      that.setState({loading: false, updatingData: false, errors: body.errors, standardsData, classrooms, students});
    });
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    const selectedClassroomId = this.state.selectedClassroomId !== showAllClassroomKey ? this.state.classrooms.find(c => c.name === this.state.selectedClassroomId) : 0
    return ([
      {
        Header: 'Standard Level',
        accessor: 'standard_level',
        sortMethod: sortByStandardLevel,
        resizable: false,
        width: 150,
        Cell: (row, selectedClassroomId) => (
          <a href={row.original['link']} style={{width: '100%', display: 'inline-block'}}>
            {row.original['standard_level_name']}
          </a>
        )
      }, {
        Header: "Standard Name",
        accessor: 'standard_name',
        sortMethod: sortByStandardLevel,
        resizable: false,
        minWidth: 300,
        Cell: (row, selectedClassroomId) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['name']}
          </a>
        )
      }, {
        Header: "Students",
        accessor: 'number_of_students',
        resizable: false,
        Cell: (row, selectedClassroomId) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['number_of_students']}
          </a>
        )
        }, {
				Header: "Proficient",
				accessor: 'proficient',
				resizable: false,
        className: blurIfNotPremium,
        Cell: (row, selectedClassroomId) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['proficient']}
          </a>
        )
				}, {
				Header: "Activities",
				accessor: 'activities',
				resizable: false,
        Cell: (row, selectedClassroomId) => (
          <a className="row-link-disguise" href={row.original['link']}>
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

  formatDataForCSV() {
    const csvData = [
      ['Standard Level', 'Standard Name', 'Students', 'Proficient', 'Activities']
    ]
    this.state.standardsData.forEach((row) => {
      csvData.push([
        row['standard_level_name'], row['name'], row['total_student_count'], `${row['proficient_count']} of ${row['total_student_count']}`, row['total_activity_count']
      ])
    })
    return csvData
  }

  formatStandardsData(data) {
    const { selectedClassroomId, } = this.state
    return data.map((row) => {
      row.standard_level = row.standard_level_name
      row.standard_name = row.name
      row.number_of_students = Number(row.total_student_count)
      row.proficient = `${row.proficient_count} of ${row.total_student_count}`
      row.activities = Number(row.total_activity_count)
      row.green_arrow = (
        <a className='green-arrow' href={`/teachers/progress_reports/standards/classrooms/${selectedClassroomId || 0}/standards/${row.id}/students`}>
          <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
        </a>
      )
      row.link = `/teachers/progress_reports/standards/classrooms/${selectedClassroomId || 0}/standards/${row.id}/students`
      return row
    })
  }

  goToStudentPage = studentName => {
    const student = this.state.students.find(s => s.name === studentName)
    if (student) {
      window.location.href = `/teachers/progress_reports/standards/classrooms/0/students/${student.id}/standards`
    }
  };

  switchClassrooms = classroom => {
    if (classroom.name !== showAllClassroomKey) {
      window.history.pushState({}, '', `${window.location.pathname}?classroom_id=${classroom.id}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }

    this.setState({selectedClassroomId: classroom.id, updatingData: true}, () => this.getData())
  };

  tableOrEmptyMessage(){
      const data = this.state.standardsData
      if (data.length) {
        return (
          <div key={`${data.length}-length-for-activities-scores-by-classroom`}>
            <ReactTable
              className='progress-report has-green-arrow'
              columns={this.columns()}
              data={data}
              defaultPageSize={data.length}
              defaultSorted={[{id: 'standard_level', desc: false}]}
              showPageSizeOptions={false}
              showPagination={false}
              showPaginationBottom={false}
              showPaginationTop={false}
            /></div>
        )
      } else {
        return <EmptyStateForReport />
      }
    }

  render() {
    const { classrooms, selectedClassroomId, loading, students, } = this.state
    const selectedClassroom = classrooms.find(c => String(c.id) === String(selectedClassroomId))

    if (loading) {
      return <LoadingSpinner />
    }

    return (
      <div className='standards-all-classrooms progress-reports-2018 '>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Standards Report</h1>
            <p>Each activity on Quill is aligned to a Common Core standard. This reports shows your students’ overall progress on each of the standards. You can filter by student on this page to see one student’s progress on all of the standards. You can click on an individual standard to see all of the student results for that standard.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.formatDataForCSV()} key={`data is updating: ${this.state.updatingData}`} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div className='dropdown-container' id="flexed">
          <ItemDropdown callback={this.switchClassrooms} items={classrooms} selectedItem={selectedClassroom} />
          <ItemDropdown callback={this.goToStudentPage} items={_.uniq(students.map(s => s.name))} />
        </div>
        {this.tableOrEmptyMessage()}
      </div>
    )
  }
}
