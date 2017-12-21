// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import request from 'request'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {sortByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import ClassroomDropdown from '../general_components/dropdown_selectors/classroom_dropdown'

const showAllClassroomKey = 'All Classrooms'

export default class extends React.Component {

  constructor(props) {
    super()
    this.state = {
      loading: true,
      errors: false,
      selectedClassroom: showAllClassroomKey
    }
    this.switchClassrooms = this.switchClassrooms.bind(this)
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`
    }, (e, r, body) => {
      const data = JSON.parse(body)
      const parsedClassrooms = this.parseClassrooms(data.classrooms_with_student_ids)
      const dropdownClassrooms = parsedClassrooms.dropdownClassrooms;
      const classroomsWithStudentIds = parsedClassrooms.classroomsWithStudentIds
      that.setState({loading: false, errors: body.errors, reportData: data.students, filteredReportData: data.students, dropdownClassrooms, classroomsWithStudentIds});
    });
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

  switchClassrooms(classroom){
    this.setState({selectedClassroom: classroom}, this.filterReportsData)
  }

  filterReportsData(){
    console.log('filtering!');
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (
          <a href={row.original['concepts_href']}>{row.original['name']}</a>
        )
      }, {
        Header: 'Questions',
        accessor: 'total_result_count',
        resizable: false
      }, {
        Header: 'Correct',
        accessor: 'correct_result_count',
        resizable: false
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false,
        Cell: props => props.value + '%'
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        className: 'hi',
        width: 80,
        Cell: props => props.value
      }
    ])
  }

  render() {
    if (this.state.loading || !this.state.reportData) {
      return <LoadingSpinner/>
    }
    return (
      <div className='progress-reports-2018'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1>Concept Results</h1>
            <p>Each time a student correctly demonstrates a concept or creates an error, Quill generates a concept result. This report provides an aggregate picture of student progress on each concept.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
          <div className='dropdown-container'>
            <ClassroomDropdown classrooms={this.state.dropdownClassrooms} callback={this.switchClassrooms} selectedClassroom={this.state.selectedClassroom}/>
          </div>
        </div>
        <ReactTable data={this.state.reportData} columns={this.columns()} showPagination={false} defaultSorted={[{
            id: 'last_active',
            desc: true
          }
        ]} showPaginationTop={false} showPaginationBottom={false} showPageSizeOptions={false} defaultPageSize={this.state.reportData.length} className='progress-report has-green-arrow'/>
      </div>
    )
  }

};
