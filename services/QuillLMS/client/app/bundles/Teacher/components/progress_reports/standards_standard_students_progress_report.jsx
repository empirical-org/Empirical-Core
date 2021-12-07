// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import request from 'request'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import {sortByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import userIsPremium from '../modules/user_is_premium'
import { getTimeSpent } from '../../helpers/studentReports'

const showAllClassroomKey = 'All classrooms'

export default class IndividualStandardsReport extends React.Component {
  state = {
    loading: true,
    errors: false,
    userIsPremium: userIsPremium()
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.setState({loading: true}, () => {
      const { sourceUrl } = this.props;
      const { standard, selectedClassroom } = this.state;
      const selectedStandardId = standard ? standard.id : null
      const selectedClassroomId = selectedClassroom && selectedClassroom.id ? selectedClassroom.id : 0
      const url = selectedStandardId && selectedClassroomId ? `${process.env.DEFAULT_URL}/teachers/progress_reports/standards/classrooms/${selectedClassroomId}/standards/${selectedStandardId}/students.json` : `${process.env.DEFAULT_URL}/${sourceUrl}`
      request.get({
        url: url
      }, (e, r, body) => {
        const data = JSON.parse(body)
        const studentData = this.formattedStudentData(data.students)
        const csvData = this.formatDataForCSV(data.students)
        const standard = data.standards[0]
        const classrooms = JSON.parse(body).classrooms
        const allClassrooms = {name: showAllClassroomKey}
        const selectedClassroom = data.selected_classroom ? data.selected_classroom : allClassrooms
        classrooms.unshift(allClassrooms)
        this.setState({loading: false, errors: body.errors, studentData, csvData, standard, classrooms, selectedClassroom});
      });
    })
  }

  columns() {
    const { userIsPremium } = this.state;
    const blurIfNotPremium = userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (
          <a href={row.original['concepts_href']}><span className='row-link-disguise underlined'>{row.original['name']}</span></a>
        )
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        resizable: false
      }, {
        Header: 'Time spent',
        accessor: 'timespent',
        className: blurIfNotPremium,
        resizable: false,
        Cell: row => (
          row.original['timespent'] ? getTimeSpent(row.original['timespent']) : ''
        )
      }, {
        Header: 'Avg. score',
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
          <span><span className={row.original['mastery_status'] === 'Proficient' ? 'proficient-indicator' : 'not-proficient-indicator'} />{row.original['mastery_status']}</span>
        )
      }
    ])
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Student', 'Activities', 'Average', 'Proficiency Status']
    ]
    data.forEach((row) => {
      csvData.push([
        row['name'], row['total_activity_count'], `${row['average_score']}%`, row['mastery_status']
      ])
    })
    return csvData
  }

  formattedStudentData(data) {
    return data.map((row) => {
      row.name = row.name
      row.total_activity_count = Number(row.total_activity_count)
      row.average_score = Number(row.average_score * 100)
      row.proficiency_status = row.proficiency_status
      row.green_arrow = (
        <a className='green-arrow' href={row.student_standards_href}>
          <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
        </a>
      )
      return row
    })
  }

  switchClassrooms = classroomName => {
    const { classrooms } = this.state;
    const classroom = classrooms.find(c => c.name === classroomName)
    this.setState({ selectedClassroom: classroom }, this.getData)
  };

  render() {
    const { loading, studentData, standard, csvData, classrooms, selectedClassroom } = this.state;
    if (loading || !studentData) {
      return <LoadingSpinner />
    }
    return (
      <div className='progress-reports-2018 individual-standard'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1><span>Standards Report:</span> {standard.name}</h1>
            <p>You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={csvData} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
          <div className='dropdown-container'>
            <ItemDropdown callback={this.switchClassrooms} isSearchable={true} items={classrooms.map(c => c.name)} selectedItem={selectedClassroom.name} />
          </div>
        </div>
        <div key={`concept-progress-report-length-${studentData.length}`}>
          <ReactTable
            className='progress-report'
            columns={this.columns()}
            data={studentData}
            defaultPageSize={studentData.length}
            defaultSorted={[{
              id: 'average_score',
              desc: false
            }
          ]}
            showPageSizeOptions={false}
            showPagination={false}
            showPaginationBottom={false}
            showPaginationTop={false}
          />
        </div>
      </div>
    )
  }
};
