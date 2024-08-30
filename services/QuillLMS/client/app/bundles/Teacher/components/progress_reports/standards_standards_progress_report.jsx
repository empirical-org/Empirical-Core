import React from 'react'

import { NOT_SCORED_DISPLAY_TEXT } from './constants.js'

import { requestGet, } from '../../../../modules/request/index'
import { sortTableByStandardLevel } from '../../../../modules/sortingMethods.js'
import { ReactTable, ReportHeader, singleUserIcon, } from '../../../Shared/index'
import { getTimeSpent, renderTooltipRow } from '../../helpers/studentReports'
import userIsPremium from '../modules/user_is_premium'
import LoadingSpinner from '../shared/loading_indicator.jsx'

const PROFICIENT = 'proficient'

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
    requestGet(
      `${process.env.DEFAULT_URL}/${sourceUrl}`,
      (body) => {
        const data = body.standards
        const student = body.student
        const csvData = this.formatDataForCSV(data, student.name)
        const standardsData = this.formatStandardsData(data)
        // gets unique classroom names
        this.setState({loading: false, errors: body.errors, standardsData, csvData, student});
      }
    )
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
        maxWidth: 150
      }, {
        Header: "Standard name",
        accessor: 'standard_name',
        sortType: sortTableByStandardLevel,
        minWidth: 500,
        resizable: false,
        Cell: ({ row }) => {
          const { original } = row
          const { id, name, standard_students_href } = original
          return renderTooltipRow({ id, label: name, link: standard_students_href, headerWidth: 500 })
        },
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        maxWidth: 100,
        resizable: false
      }, {
        Header: 'Time spent',
        accessor: 'timespent',
        resizable: false,
        maxWidth: 100,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{getTimeSpent(row.original['timespent'])}</span>
      }, {
        Header: 'Average score',
        accessor: 'average_score',
        resizable: false,
        maxWidth: 160,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{`${row.original['average_score']}`}</span>
      }, {
        Header: 'Proficiency Status',
        accessor: 'mastery_status',
        resizable: false,
        maxWidth: 200,
        Cell: ({ row }) => {
          const proficiencyStatus = row.original['mastery_status'] === 'Proficient' ? PROFICIENT : 'not-proficient'
          const proficientIconSrc = `${process.env.CDN_URL}/images/icons/2xs/proficiency-circle/proficient.svg`
          const notProficienctIconSrc = `${process.env.CDN_URL}/images/icons/2xs/proficiency-circle/no-proficiency.svg`
          return (
            <span className={`proficiency-chip ${blurIfNotPremium} ${proficiencyStatus}`}>
              <img alt="proficiency indicator" src={proficiencyStatus === PROFICIENT ? proficientIconSrc : notProficienctIconSrc} />
              <span>{row.original['mastery_status']}</span>
            </span>
          )
        }
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
      const showNotScored = row.is_evidence && row.total_scored_student_count === 0

      row.standard_level = row.standard_level_name
      row.standard_name = row.name
      row.activities = Number(row.total_activity_count)
      row.average_score = showNotScored ? NOT_SCORED_DISPLAY_TEXT : `${Number(row.average_score * 100)}%`
      row.mastery_status = showNotScored ? NOT_SCORED_DISPLAY_TEXT : row.mastery_status
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
    const subHeaderElement = (
      <div className="student-badge">
        <img alt={singleUserIcon.alt} src={singleUserIcon.src} />
        <p>{student.name}</p>
      </div>
    )
    return (
      <div className='teacher-report-container individual-student progress-reports-2018'>
        <ReportHeader
          csvData={csvData}
          headerText="Standards Report"
          subHeaderElement={subHeaderElement}
        />
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
