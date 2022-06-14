import React from 'react'
import request from 'request'
import _ from 'underscore'

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import { NOT_SCORED_DISPLAY_TEXT } from './constants.js'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import userIsPremium from '../modules/user_is_premium'
import {sortTableByStandardLevel} from '../../../../modules/sortingMethods.js'
import { getTimeSpent } from '../../helpers/studentReports'
import { ReactTable, } from '../../../Shared/index'

export default class StandardsProgressReport extends React.Component {
  constructor() {
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
    const { sourceUrl } = this.props;
    request.get({
      url: `${process.env.DEFAULT_URL}/${sourceUrl}`
    }, (e, r, body) => {
      const parsedBody = JSON.parse(body)
      const data = parsedBody.standards
      const student = parsedBody.student
      const csvData = this.formatDataForCSV(data, student.name)
      const standardsData = this.formatStandardsData(data)
      // gets unique classroom names
      this.setState({loading: false, errors: body.errors, standardsData, csvData, student});
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
        width: 150
      }, {
        Header: "Standard name",
        accessor: 'standard_name',
        sortType: sortTableByStandardLevel,
        minWidth: 200,
        resizable: false,
        Cell: ({row}) => (
          <a className='row-link-disguise underlined' href={`/teachers/progress_reports/standards/classrooms/0/standards/${row.original['id']}/students`}>
            {row.original['standard_name']}
          </a>
        )
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        width: 115,
        resizable: false
      }, {
        Header: 'Time spent',
        accessor: 'timespent',
        className: blurIfNotPremium,
        resizable: false,
        width: 100,
        Cell: ({row}) => (
          getTimeSpent(row.original['timespent'])
        )
      }, {
        Header: 'Avg. score',
        accessor: 'average_score',
        className: blurIfNotPremium,
        resizable: false,
        width: 100,
        Cell: ({row}) => (
          `${row.original['average_score']}`
        )
      }, {
        Header: 'Proficiency Status',
        accessor: 'mastery_status',
        className: blurIfNotPremium,
        resizable: false,
        width: 165,
        Cell: ({row}) => (
          <span><span className={row.original['mastery_status'] === 'Proficient' ? 'proficient-indicator' : 'not-proficient-indicator'} />{row.original['mastery_status']}</span>
        )
      }
    ])
  }

  filteredData() {
    const { standardsData } = this.state;
    return standardsData
  }

  formatDataForCSV(data, studentName) {
    const csvData = [
      ['Standard Level', 'Standard Name', 'Activities', 'Time Spent', 'Average', 'Proficiency Status', 'Student Name']
    ]
    data.forEach((row) => {
      csvData.push([
        row['standard_level_name'], row['name'], row['total_activity_count'], getTimeSpent(row['timespent']), `${row['average_score'] * 100}%`, row['mastery_status'], studentName,
      ])
    })
    return csvData
  }

  formatStandardsData(data) {
    return data.map((row) => {
      row.standard_level = row.standard_level_name
      row.standard_name = row.name
      row.activities = Number(row.total_activity_count)
      row.average_score = row.is_evidence ? NOT_SCORED_DISPLAY_TEXT : `${Number(row.average_score * 100)}%`
      row.mastery_status = row.is_evidence ? NOT_SCORED_DISPLAY_TEXT : row.mastery_status
      row.green_arrow = (
        <a className='green-arrow' href={`/teachers/progress_reports/standards/classrooms/0/standards/${row.id}/students`}>
          <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
        </a>
      )
      return row
    })
  }

  switchClassrooms = classroom => {
    this.setState({selectedClassroom: classroom}, () => this.getData())
  };

  render() {
    const { errors, loading, student, csvData } = this.state;
    if (errors) {
      return <div className='errors'>{errors}</div>
    }
    if (loading) {
      return <LoadingSpinner />
    }
    const filteredData = this.filteredData()
    return (
      <div className='individual-student progress-reports-2018 '>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1><span>Standards Report:</span> {student.name}</h1>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport className="button-green" data={csvData} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div key={`${filteredData.length}-length-for-activities-scores-by-classroom`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={filteredData}
            defaultSorted={[{id: 'average_score', desc: false}]}
          />
        </div>
      </div>
    )
  }
}
