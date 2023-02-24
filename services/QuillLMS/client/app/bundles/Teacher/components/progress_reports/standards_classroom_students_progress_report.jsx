// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import {sortTableByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import userIsPremium from '../modules/user_is_premium'
import { ReactTable, } from '../../../Shared/index'
import { requestGet, } from '../../../../modules/request/index'

const showAllClassroomKey = 'All Classrooms'

export default class extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey,
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    const that = this;

    requestGet(
      `${import.meta.env.VITE_DEFAULT_URL}/${this.props.sourceUrl}`,
      (body) => {
        const parsedClassrooms = this.parseClassrooms(body.classrooms_with_student_ids)
        const dropdownClassrooms = parsedClassrooms.dropdownClassrooms;
        const classroomsWithStudentIds = parsedClassrooms.classroomsWithStudentIds
        that.setState({loading: false, errors: body.errors, reportData: body.students, filteredReportData: body.students, dropdownClassrooms, classroomsWithStudentIds});
      }
    )
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortType: sortTableByLastName,
        Cell: ({row}) => (
          <a href={row.original['concepts_href']}>{row.original['name']}</a>
        )
      }, {
        Header: 'Activities',
        accessor: 'total_activity_count',
        resizable: false,
      }, {
        Header: 'Average',
        accessor: 'average_score',
        resizable: false,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{row.original['average_score']}</span>
      }, {
        Header: 'Proficiency Status',
        accessor: 'mastery_status',
        resizable: false,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{row.original['mastery_status']}</span>
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        maxWidth: 80,
        Cell: ({row}) => (
          <a className='green-arrow' href={row.original['concepts_href']}>
            <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
          </a>
        )
      }
    ])
  }

  filterReportData(){
    if (this.state.selectedClassroom.id === showAllClassroomKey) {
      this.setState({filteredReportData: this.state.reportData})
    } else {
      const validStudentIds = this.state.classroomsWithStudentIds[this.state.selectedClassroom.id]
      const filteredReportData = this.state.reportData.filter((student)=> validStudentIds.includes(student.id))
      this.setState({filteredReportData})
    }
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
    this.setState({selectedClassroom: classroom}, this.filterReportData)
  };

  render() {
    if (this.state.loading || !this.state.reportData) {
      return <LoadingSpinner />
    }
    const changeValues = [{key: 'percentage', function: ((num)=>num.toString() + '%')}]
    return (
      <div className='progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Concept Results</h1>
            <p>Each time a student correctly demonstrates a concept or creates an error, Quill generates a concept result. This report provides an aggregate picture of student progress on each concept.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.filteredReportData} keysToOmit={['concepts_href']} valuesToChange={changeValues} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
          <div className='dropdown-container'>
            <ItemDropdown callback={this.switchClassrooms} items={this.state.dropdownClassrooms} selectedItem={this.state.selectedClassroom} />
          </div>
        </div>
        <div key={`concept-progress-report-length-${this.state.filteredReportData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={this.state.filteredReportData}
            defaultSorted={[{
              id: 'total_result_count',
              desc: true
            }
            ]}
          />
        </div>
      </div>
    )
  }
};
