// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import request from 'request'
import ReactTable from 'react-table'

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import 'react-table/react-table.css'
import {sortByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import userIsPremium from '../modules/user_is_premium'

const showAllClassroomKey = 'All Classrooms'

export default class IndividualStandardsReport extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: true,
      errors: false,
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.setState({loading: true}, () => {
      const that = this;
      const selectedTopicId = this.state.topic ? this.state.topic.id : null
      const selectedClassroomId = this.state.selectedClassroom && this.state.selectedClassroom.id ? this.state.selectedClassroom.id : 0
      const url = selectedTopicId && selectedClassroomId ? `${process.env.DEFAULT_URL}/teachers/progress_reports/standards/classrooms/${selectedClassroomId}/topics/${selectedTopicId}/students.json` : `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`
      request.get({
        url: url
      }, (e, r, body) => {
        const data = JSON.parse(body)
        const studentData = this.formattedStudentData(data.students)
        const csvData = this.formatDataForCSV(data.students)
        const topic = data.topics[0]
        const classrooms = JSON.parse(body).classrooms
        const allClassrooms = {name: showAllClassroomKey}
        const selectedClassroom = data.selected_classroom ? data.selected_classroom : allClassrooms
        classrooms.unshift(allClassrooms)
        that.setState({loading: false, errors: body.errors, studentData, csvData, topic, classrooms, selectedClassroom});
      });
    })
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (
          <a href={row.original['concepts_href']}><span className='green-text'>{row.original['name']}</span></a>
        )
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
          <span><span className={row.original['mastery_status'] === 'Proficient' ? 'proficient-indicator' : 'not-proficient-indicator'} />{row.original['mastery_status']}</span>
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
        <a className='green-arrow' href={row.student_topics_href}>
          <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
        </a>
      )
      return row
    })
  }

  switchClassrooms = classroomName => {
    const classroom = this.state.classrooms.find(c => c.name === classroomName)
    this.setState({ selectedClassroom: classroom }, this.getData)
  };

  render() {
    if (this.state.loading || !this.state.studentData) {
      return <LoadingSpinner />
    }
    return (
      <div className='progress-reports-2018 individual-standard'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1><span>Standards Report:</span> {this.state.topic.name}</h1>
            <p>You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
          <div className='dropdown-container'>
            <ItemDropdown callback={this.switchClassrooms} className="student-reports-class-dropdown" items={this.state.classrooms.map(c => c.name)} selectedItem={this.state.selectedClassroom.name} />
          </div>
        </div>
        <div key={`concept-progress-report-length-${this.state.studentData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={this.state.studentData}
            defaultPageSize={this.state.studentData.length}
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
