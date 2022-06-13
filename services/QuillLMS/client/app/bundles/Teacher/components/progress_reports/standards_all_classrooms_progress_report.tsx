import * as React from 'react'
import request from 'request'
import queryString from 'query-string';
import _ from 'underscore'

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import EmptyStateForReport from './empty_state_for_report'
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants'

import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import userIsPremium from '../modules/user_is_premium'
import {sortTableByStandardLevel} from '../../../../modules/sortingMethods.js'
import { Tooltip, ReactTable, } from '../../../Shared/index'
import { getTimeSpent } from '../../helpers/studentReports';


interface StandardsAllClassroomsProgressReportProps {

}

interface StandardsAllClassroomsProgressReportState {
  loading: boolean,
  errors: boolean,
  selectedClassroomId: string | string[],
  standardsData: Array<Object>,
  students: Array<any>,
  updatingData: boolean,
  classrooms: Array<any>,
  userIsPremium: boolean
}

const showAllClassroomKey = 'All classes'
const showAllStudentsKey = 'All students'


export default class StandardsAllClassroomsProgressReport extends React.Component<StandardsAllClassroomsProgressReportProps, StandardsAllClassroomsProgressReportState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      errors: false,
      selectedClassroomId: queryString.parse(window.location.search).classroom_id,
      updatingData: true,
      classrooms: [],
      userIsPremium: userIsPremium(),
      standardsData: null,
      students: []
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { selectedClassroomId, } = this.state

    const that = this;
    let qs = null

    if (selectedClassroomId !== null) {
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
      const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
      const classroomFromLocalStorageId = !selectedClassroomId && localStorageSelectedClassroomId && classrooms.find(c => Number(c.id) === Number(localStorageSelectedClassroomId))
      if (classroomFromLocalStorageId) {
        this.switchClassrooms(classroomFromLocalStorageId)
      } else {
        that.setState({loading: false, updatingData: false, errors: body.errors, standardsData, classrooms, students});
      }
    });
  }

  columns() {
    const { userIsPremium } = this.state;
    const blurIfNotPremium = userIsPremium ? null : 'non-premium-blur'

    return ([
      {
        Header: 'Standard level',
        accessor: 'standard_level',
        sortType: sortTableByStandardLevel,
        resizable: false,
        width: 150,
        Cell: ({row}) => (
          <a className="standard-level" href={row.original['link']}>
            {row.original['standard_level_name']}
          </a>
        )
      }, {
        Header: "Standard name",
        accessor: 'standard_name',
        sortType: sortTableByStandardLevel,
        resizable: false,
        minWidth: 300,
        Cell: ({row}) => this.renderTooltipRow(row),
        style: {overflow: 'visible'},
      }, {
        Header: "Students",
        accessor: 'number_of_students',
        resizable: false,
        Cell: ({row}) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['number_of_students']}
          </a>
        )
      }, {
        Header: "Proficient",
        accessor: 'proficient',
        resizable: false,
        className: blurIfNotPremium,
        Cell: ({row}) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['proficient']}
          </a>
        )
      }, {
        Header: "Activities",
        accessor: 'activities',
        resizable: false,
        Cell: ({row}) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {row.original['activities']}
          </a>
        )
      }, {
        Header: "Time spent",
        accessor: 'timespent',
        resizable: false,
        Cell: ({row}) => (
          <a className="row-link-disguise" href={row.original['link']}>
            {getTimeSpent(row.original['timespent'])}
          </a>
        )
      }
    ])
  }

  renderTooltipRow(row) {
    const averageFontWidth = 7
    const headerWidthNumber = 300
    const rowDisplayText = row.original['name']
    let style: React.CSSProperties = { width: `300px`, minWidth: `300px` }
    const key = `${row.id}`
    const sectionClass = 'something-class'
    const sectionText = (<a className="row-link-disguise underlined" href={row.original['link']}>
      {row.original['name']}
    </a>)
    if ((String(rowDisplayText).length * averageFontWidth) >= headerWidthNumber) {
      return (
        <Tooltip
          key={key}
          tooltipText={rowDisplayText}
          tooltipTriggerStyle={style}
          tooltipTriggerText={sectionText}
          tooltipTriggerTextClass={sectionClass}
          tooltipTriggerTextStyle={style}
        />
      )
    } else {
      return sectionText
    }
  }

  formatDataForCSV() {
    const { standardsData } = this.state;
    const csvData = [
      ['Standard Level', 'Standard Name', 'Students', 'Proficient', 'Activities', 'Time Spent']
    ]
    standardsData.forEach((row) => {
      csvData.push([
        row['standard_level_name'], row['name'], row['total_student_count'], `${row['proficient_count']} of ${row['total_student_count']}`, row['total_activity_count'], getTimeSpent(row['timespent'])
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
    const { students } = this.state;
    const student = students.find(s => s.name === studentName)
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

    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)

    this.setState({selectedClassroomId: classroom.id, updatingData: true}, () => this.getData())
  };

  tableOrEmptyMessage(){
    const { standardsData } = this.state;
    if (standardsData.length) {
      return (
        <div key={`${standardsData.length}-length-for-activities-scores-by-classroom`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={standardsData}
            defaultSorted={[{id: 'standard_level', desc: false}]}
            style={{overflow: 'visible'}}
          /></div>
      )
    } else {
      return <EmptyStateForReport />
    }
  }

  render() {
    const { classrooms, selectedClassroomId, loading, students, updatingData } = this.state
    const selectedClassroom = classrooms.find(c => String(c.id) === String(selectedClassroomId))

    if (loading) {
      return <LoadingSpinner />
    }

    return (
      <div className='standards-all-classrooms progress-reports-2018 '>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Standards Report</h1>
            <p>Each activity on Quill is aligned to a Common Core standard. This report shows your students’ overall progress on each of the standards. You can filter by student on this page to see one student’s progress on all of the standards. You can click on an individual standard to see all of the student results for that standard.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.formatDataForCSV()} key={`data is updating: ${updatingData}`} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div className='standards-all-classrooms-dropdown-container' id="flexed">
          <ItemDropdown callback={this.switchClassrooms} isSearchable={true} items={classrooms} selectedItem={selectedClassroom} />
          <ItemDropdown callback={this.goToStudentPage} isSearchable={true} items={_.uniq(students.map(s => s.name))} />
        </div>
        {this.tableOrEmptyMessage()}
      </div>
    )
  }
}
