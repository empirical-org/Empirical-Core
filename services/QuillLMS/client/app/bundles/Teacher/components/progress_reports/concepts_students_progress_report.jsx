// The progress report showing all students in a given classroom
// along with their result counts.
import queryString from 'query-string';
import React from 'react';

import EmptyStateForReport from './empty_state_for_report';
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants';

import { requestGet, } from '../../../../modules/request/index';
import { sortTableByLastName } from '../../../../modules/sortingMethods.js';
import { ReactTable, ReportHeader, accountGreenIcon } from '../../../Shared/index';
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown';
import userIsPremium from '../modules/user_is_premium';
import LoadingSpinner from '../shared/loading_indicator.jsx';
import { renderTooltipRow } from '../../helpers/studentReports';

const showAllClassroomKey = 'All Classrooms'

export default class ConceptsStudentsProgressReport extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroomId: showAllClassroomKey,
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    const that = this;
    requestGet(
      `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`,
      (body) => {
        const parsedClassrooms = this.parseClassrooms(body.classrooms_with_student_ids)
        const dropdownClassrooms = parsedClassrooms.dropdownClassrooms;
        const classroomsWithStudentIds = parsedClassrooms.classroomsWithStudentIds

        const newState = {loading: false, errors: body.errors, reportData: body.students, filteredReportData: body.students, dropdownClassrooms, classroomsWithStudentIds}

        const selectedClassroomId = queryString.parse(window.location.search).classroom_id
        const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)

        if (selectedClassroomId) {
          newState.selectedClassroomId = selectedClassroomId
        } else if (localStorageSelectedClassroomId && dropdownClassrooms.find(c => Number(c.id) === Number(localStorageSelectedClassroomId))) {
          newState.selectedClassroomId = Number(localStorageSelectedClassroomId)
        }
        that.setState(newState, this.filterReportData);
      }
    )
  }

  columns() {
    const { userIsPremium, } = this.state
    const blurIfNotPremium = userIsPremium ? null : 'non-premium-blur'
    const cellClassName = `row-link-disguise ${blurIfNotPremium}`
    const nameHeaderWidth = 360
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortType: sortTableByLastName,
        maxWidth: nameHeaderWidth,
        Cell: ({ row }) => {
          const { original } = row
          const { id, name, concepts_href } = original
          return renderTooltipRow({ icon: accountGreenIcon, id, label: name, link: concepts_href, headerWidth: nameHeaderWidth })
        },
      }, {
        Header: 'Questions',
        accessor: 'total_result_count',
        resizable: false,
        maxWidth: 210,
        Cell: ({row}) => (
          <a className="row-link-disguise" href={row.original['concepts_href']}>{row.original['total_result_count']}</a>
        )
      }, {
        Header: 'Correct',
        accessor: 'correct_result_count',
        resizable: false,
        maxWidth: 210,
        Cell: ({row}) => (
          <a className={cellClassName} href={row.original['concepts_href']}>{row.original['correct_result_count']}</a>
        )
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false,
        maxWidth: 210,
        Cell: ({row}) => (
          <a className={cellClassName} href={row.original['concepts_href']}>{row.original['incorrect_result_count']}</a>
        )
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false,
        maxWidth: 210,
        Cell: ({row}) => (
          <a className={cellClassName} href={row.original['concepts_href']}>{row.original['percentage']}%</a>
        )
      }
    ])
  }

  filterReportData(){
    const { selectedClassroomId, reportData, classroomsWithStudentIds, } = this.state
    let filteredReportData;
    if (selectedClassroomId === showAllClassroomKey) {
      // because we are showing all classrooms, we show all data
      filteredReportData = reportData;
    } else {
      const validStudentIds = classroomsWithStudentIds[selectedClassroomId]
      filteredReportData = reportData.filter((student)=> validStudentIds.includes(student.id))
    }
    this.setState({ filteredReportData, updatingReportData: false})
  }

  keysToOmit(){
    return ['concepts_href']
  }

  parseClassrooms(classrooms){
    const classroomsWithStudentIds = {}
    const dropdownClassrooms = [{id: showAllClassroomKey, name: showAllClassroomKey}];
    classrooms.forEach((c)=>{
      classroomsWithStudentIds[c.id] = c.student_ids;
      dropdownClassrooms.push({id: c.id, name: c.name})
    })
    return {dropdownClassrooms, classroomsWithStudentIds }
  }

  switchClassrooms = classroom => {
    const { dropdownClassrooms, } = this.state
    const classroomRecord = dropdownClassrooms.find(c => c.id === classroom.id)
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)

    if (classroomRecord && classroomRecord.id !== showAllClassroomKey) {
      window.history.pushState({}, '', `${window.location.pathname}?classroom_id=${classroomRecord.id}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
    this.setState({selectedClassroomId: classroom.id, updatingReportData: true, }, this.filterReportData)
  };

  tableOrEmptyMessage(){
    const { filteredReportData, } = this.state
    if (filteredReportData.length) {
      return (
        <div key={`concept-progress-report-length-${filteredReportData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={filteredReportData}
            defaultSorted={[{
              id: 'total_result_count',
              desc: true
            }
            ]}
          />
        </div>
      )
    } else {
      return <EmptyStateForReport />
    }
  }

  render() {
    const { loading, reportData, dropdownClassrooms, selectedClassroomId, filteredReportData, updatingReportData, } = this.state
    if (loading || !reportData) {
      return <LoadingSpinner />
    }
    const changeValues = [{key: 'percentage', function: ((num)=>num.toString() + '%')}]

    const selectedClassroom = dropdownClassrooms.find(c => String(c.id) === String(selectedClassroomId))

    return (
      <div className='teacher-report-container concepts-overview progress-reports-2018'>
        <ReportHeader
          csvData={filteredReportData}
          headerText="Concept Results"
          key={`reports are ready ${updatingReportData}`}
          keysToOmit={this.keysToOmit()}
          tooltipText="Each question on Quill targets a specific writing concept. This report shows the number of times the student correctly or incorrectly used the targeted concept to answer the question. You can see a student’s results on each concept by clicking on the student’s name. You can print this report by downloading a PDF file or export this data by downloading a CSV file."
          valuesToChange={changeValues}
        />
        <div className='dropdown-container'>
          <ItemDropdown callback={this.switchClassrooms} className="bordered-dropdown dropdown-with-icon" items={dropdownClassrooms} selectedItem={selectedClassroom} />
        </div>
        {this.tableOrEmptyMessage()}
      </div>
    )
  }
};
