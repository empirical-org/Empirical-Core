// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'

import { NOT_SCORED_DISPLAY_TEXT } from './constants.js'

import { requestGet, } from '../../../../modules/request/index'
import { sortTableByLastName } from '../../../../modules/sortingMethods.js'
import { ReactTable, ReportHeader, accountGreyIcon, } from '../../../Shared/index'
import { getTimeSpent, renderTooltipRow } from '../../helpers/studentReports'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import userIsPremium from '../modules/user_is_premium'
import LoadingSpinner from '../shared/loading_indicator.jsx'

const showAllClassroomKey = 'All classrooms'
const PROFICIENT = 'proficient'

export default class IndividualStandardsReport extends React.Component {
  state = {
    loading: true,
    errors: false,
    userIsPremium: userIsPremium()
  }

  componentDidMount() {
    this.getData()
  }

  decorateAsEvidence(standard) {
    return standard && standard.is_evidence && standard.total_scored_student_count === 0
  }

  getData() {
    this.setState({loading: true}, () => {
      const { sourceUrl } = this.props;
      const { standard, selectedClassroom } = this.state;
      const selectedStandardId = standard ? standard.id : null
      const selectedClassroomId = selectedClassroom && selectedClassroom.id ? selectedClassroom.id : 0
      const url = selectedStandardId && selectedClassroomId ? `${process.env.DEFAULT_URL}/teachers/progress_reports/standards/classrooms/${selectedClassroomId}/standards/${selectedStandardId}/students.json` : `${process.env.DEFAULT_URL}/${sourceUrl}`
      requestGet(
        url,
        (body) => {
          const decorateAsEvidence = this.decorateAsEvidence(body.standards[0])
          const studentData = this.formattedStudentData(body.students, decorateAsEvidence)
          const csvData = this.formatDataForCSV(body.students)
          const standard = body.standards[0]
          const classrooms = body.classrooms

          const allClassrooms = {name: showAllClassroomKey}
          const selectedClassroom = body.selected_classroom ? body.selected_classroom : allClassrooms
          classrooms.unshift(allClassrooms)
          this.setState({loading: false, errors: body.errors, studentData, csvData, standard, classrooms, selectedClassroom});
        }
      );
    })
  }

  columns() {
    const { userIsPremium } = this.state;
    const blurIfNotPremium = userIsPremium ? null : 'non-premium-blur'
    const nameHeaderWidth = 360
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortType: sortTableByLastName,
        Cell: ({ row }) => {
          const { original } = row
          const { id, name, student_standards_href } = original
          return renderTooltipRow({ color: 'grey', icon: accountGreyIcon, id, label: name, link: student_standards_href, headerWidth: nameHeaderWidth })
        },
        minWidth: nameHeaderWidth
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        resizable: false,
        maxWidth: 210
      }, {
        Header: 'Time spent',
        accessor: 'timespent',
        resizable: false,
        maxWidth: 210,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{getTimeSpent(row.original['timespent'])}</span>
      }, {
        Header: 'Average score',
        accessor: 'average_score',
        resizable: false,
        maxWidth: 210,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{`${row.original['average_score']}`}</span>
      }, {
        Header: 'Proficiency Status',
        accessor: 'mastery_status',
        resizable: false,
        maxWidth: 210,
        Cell: ({row}) => {
          const proficiencyStatus = row.original['mastery_status'] === 'Proficient' ? PROFICIENT : 'not-proficient'
          const proficientIconSrc = `${process.env.CDN_URL}/images/icons/2xs/proficiency-circle/proficient.svg`
          const notProficienctIconSrc = `${process.env.CDN_URL}/images/icons/2xs/proficiency-circle/no-proficiency.svg`
          return(
            <span className={`proficiency-chip ${blurIfNotPremium} ${proficiencyStatus}`}>
              <img alt="proficiency indicator" src={proficiencyStatus === PROFICIENT ? proficientIconSrc : notProficienctIconSrc} />
              <span>{row.original['mastery_status']}</span>
            </span>
          )
        }
      }
    ])
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Student', 'Activities', 'Time Spent', 'Average', 'Proficiency Status']
    ]
    data.forEach((row) => {
      csvData.push([
        row['name'], row['total_activity_count'], getTimeSpent(row['timespent']), `${row['average_score']}%`, row['mastery_status']
      ])
    })
    return csvData
  }

  formattedStudentData(data, decorateAsEvidence=false) {
    return data.map((row) => {
      row.name = row.name
      row.total_activity_count = Number(row.total_activity_count)
      row.average_score = decorateAsEvidence ? NOT_SCORED_DISPLAY_TEXT : `${Number(row.average_score * 100)}%`
      row.mastery_status = decorateAsEvidence ? NOT_SCORED_DISPLAY_TEXT : row.mastery_status
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
      <div className='teacher-report-container progress-reports-2018 individual-standard'>
        <ReportHeader
          csvData={csvData}
          headerText="Standards Report:"
          subHeaderElement={<p className="report-sub-header">{standard.name}</p>}
          tooltipText="You can print this report by downloading a PDF file or export this data by downloading a CSV file."
        />
        <div className='dropdown-container'>
          <ItemDropdown callback={this.switchClassrooms} className="bordered-dropdown dropdown-with-icon" isSearchable={true} items={classrooms.map(c => c.name)} selectedItem={selectedClassroom.name} />
        </div>
        <div key={`concept-progress-report-length-${studentData.length}`}>
          <ReactTable
            className='progress-report'
            columns={this.columns()}
            data={studentData}
            defaultSorted={[{
              id: 'average_score',
              desc: false
            }
            ]}
          />
        </div>
      </div>
    )
  }
};
