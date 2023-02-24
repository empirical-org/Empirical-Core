import React from 'react'
import _ from 'underscore'
import queryString from 'query-string';
import moment from 'moment'

import EmptyStateForReport from './empty_state_for_report'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants'

import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import {sortTableByLastName, sortTableFromSQLTimeStamp} from '../../../../modules/sortingMethods.js'
import { getTimeSpent } from '../../helpers/studentReports';
import { ReactTable, Tooltip } from '../../../Shared/index'
import { requestGet, } from '../../../../modules/request/index'

const showAllClassroomKey = 'All classes'

export class ActivitiesScoresByClassroomProgressReport extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey
    }
  }

  componentDidMount() {
    requestGet(
      `${import.meta.env.VITE_DEFAULT_URL}/api/v1/progress_reports/activities_scores_by_classroom_data`,
      (body) => {
        const classroomsData = body.data;
        // gets unique classroom names
        const classroomNames = Array.from(new Set(classroomsData.map(row => row.classroom_name)))
        classroomNames.unshift(showAllClassroomKey)

        const newState = {loading: false, errors: body.errors, classroomsData, classroomNames}
        const selectedClassroomId = queryString.parse(window.location.search).classroom_id

        const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
        const localStorageSelectedClassroom = localStorageSelectedClassroomId && classroomsData.find(c => Number(c.classroom_id) === Number(localStorageSelectedClassroomId))

        if (selectedClassroomId) {
          const selectedClassroom = classroomsData.find(c => Number(c.classroom_id) === Number(selectedClassroomId))
          newState.selectedClassroom = selectedClassroom.classroom_name || showAllClassroomKey
        } else if (localStorageSelectedClassroom) {
          newState.selectedClassroom = localStorageSelectedClassroom.classroom_name
        }

        this.setState(newState);
      }
    )
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortType: sortTableByLastName,
        Cell: ({row}) => (<a className='row-link-disguise underlined' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {row.original.name}
        </a>),
      }, {
        Header: "Activities completed",
        accessor: 'activity_count',
        resizable: false,
        minWidth: 186,
        Cell: ({row}) => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {Number(row.original.activity_count)}
        </a>),
      }, {
        Header: "Overall score",
        accessor: 'average_score',
        resizable: false,
        minWidth: 80,
        Cell: ({row}) => {
          const value = Math.round(parseFloat(row.original.average_score) * 100);
          return (
            <a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
              {isNaN(value) ? '--' : value + '%'}
            </a>
          )
        }
      },
      {
        Header: "Time spent",
        accessor: 'timespent',
        resizable: false,
        minWidth: 80,
        Cell: ({row}) => {
          const value = row.original.timespent;
          return (
            <a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
              {getTimeSpent(value)}
            </a>
          )
        }
      },
      {
        Header: "Last active",
        accessor: 'last_active',
        resizable: false,
        minWidth: 90,
        Cell: ({row}) => (<a className='row-link-disguise' href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`}>
          {row.original.last_active ? moment(row.original.last_active).format("MM/DD/YYYY") : <span>N/A</span>}
        </a>),
        sortType: sortTableFromSQLTimeStamp,
      },
      {
        Header: "Class",
        accessor: 'classroom_name',
        resizable: false,
        Cell: ({row}) => {
          const tooltipText = `<p>${row.original.classroom_name}</p>`;
          const tooltipTriggerElement = <a className="tooltip-trigger row-link-disguise" href={`/teachers/progress_reports/student_overview?classroom_id=${row.original.classroom_id}&student_id=${row.original.student_id}`} rel='noreferrer noopener' target="_blank">{row.original.classroom_name}</a>
          return(
            <Tooltip
              tooltipText={tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          )
        },
        style: { overflow: 'visible' }
      }
    ])
  }

  filteredClassroomsData() {
    const { classroomsData, selectedClassroom } = this.state;
    if (selectedClassroom === showAllClassroomKey) {
      return classroomsData
    }
    return classroomsData.filter((row) => row.classroom_name === selectedClassroom)
  }

  formatDataForCSV(data) {
    const csvData = [
      ['Classroom Name', 'Student Name', 'Average Score', 'Time Spent', 'Activity Count']
    ]
    data.forEach((row) => {
      csvData.push([
        row['classroom_name'], row['name'], (row['average_score'] * 100).toString() + '%', getTimeSpent(row['timespent']), row['activity_count']
      ])
    })
    return csvData
  }

  switchClassrooms = classroom => {
    const { classroomsData, } = this.state
    const classroomRecord = classroomsData.find(c => c.classroom_name === classroom)

    if (classroomRecord) {
      window.history.pushState({}, '', `${window.location.pathname}?classroom_id=${classroomRecord.classroom_id}`);
      window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroomRecord.classroom_id)
    } else {
      window.history.pushState({}, '', window.location.pathname);
      window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, null)
    }
    this.setState({selectedClassroom: classroom})
  };

  tableOrEmptyMessage(filteredClassroomsData){
    if (filteredClassroomsData.length) {
      return (
        <div key={`${filteredClassroomsData.length}-length-for-activities-scores-by-classroom`}>
          <ReactTable
            className='progress-report'
            columns={this.columns()}
            data={filteredClassroomsData}
            defaultSorted={[{id: 'last_active', desc: true}]}
          />
        </div>
      )
    } else {
      return <EmptyStateForReport />
    }
  }

  render() {
    const { errors, loading, selectedClassroom, classroomNames } = this.state;
    if (errors) {
      return <div className='errors'>{errors}</div>
    }
    if (loading) {
      return <LoadingSpinner />
    }
    const filteredClassroomsData = this.filteredClassroomsData()
    return (
      <div className='activities-scores-by-classroom progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Activity Scores</h1>
            <p>View the overall average score for each student in an active classroom. Click on a student’s name to see a report of each individual activity and print it as a PDF. You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.formatDataForCSV(filteredClassroomsData)} key={`${selectedClassroom} report button`} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div className='dropdown-container'>
          <ItemDropdown callback={this.switchClassrooms} items={classroomNames} selectedItem={selectedClassroom} />
        </div>
        {this.tableOrEmptyMessage(filteredClassroomsData)}
      </div>
    )
  }
}

export default ActivitiesScoresByClassroomProgressReport
