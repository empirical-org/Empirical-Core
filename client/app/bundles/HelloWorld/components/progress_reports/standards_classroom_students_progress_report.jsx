// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import request from 'request'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {sortByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown'
import userIsPremium from '../modules/user_is_premium'

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
    this.setState({selectedClassroom: classroom}, this.filterReportData)
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

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
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
        Header: 'Activities',
        accessor: 'total_activity_count',
        resizable: false,
      }, {
        Header: 'Average',
        accessor: 'average_score',
        className: blurIfNotPremium,
        resizable: false,
      }, {
        Header: 'Proficiency Status',
        accessor: 'average_score',
        className: blurIfNotPremium,
        resizable: false
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        width: 80,
        Cell: row => (
          <a className='green-arrow' href={row.original['concepts_href']}>
            <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
          </a>
        )
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
            <CSVDownloadForProgressReport data={this.state.filteredReportData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
          <div className='dropdown-container'>
            <ItemDropdown items={this.state.dropdownClassrooms} callback={this.switchClassrooms} selectedItem={this.state.selectedClassroom}/>
          </div>
        </div>
        <div key={`concept-progress-report-length-${this.state.filteredReportData.length}`}>
          <ReactTable data={this.state.filteredReportData} columns={this.columns()} showPagination={false} defaultSorted={[{
              id: 'total_result_count',
              desc: true
            }
          ]} showPaginationTop={false} showPaginationBottom={false} showPageSizeOptions={false} defaultPageSize={this.state.filteredReportData.length} className='progress-report has-green-arrow'/>
        </div>
      </div>
    )
  }

};

// "use strict";
//
// import React from 'react'
// import ProgressReport from './progress_report.jsx'
// import MasteryStatus from './mastery_status.jsx'
//
//
// export default React.createClass({
//   propTypes: {
//     sourceUrl: React.PropTypes.string.isRequired,
//     premiumStatus: React.PropTypes.string.isRequired
//   },
//
//   getInitialState: function() {
//     return {
//       classroom: {}
//     };
//   },
//
//   columnDefinitions: function() {
//     return [
//       {
//         name: 'Student',
//         field: 'name',
//         sortByField: 'sorting_name',
//         className: 'student-name-column',
//         customCell: function(row) {
//           return (
//             <a className="student-view" href={row['student_topics_href']}>{row['name']}</a>
//           );
//         }
//       },
//       {
//         name: 'Standards',
//         field: 'total_standard_count',
//         sortByField: 'total_standard_count',
//         className: 'standards-column'
//       },
//       {
//         name: 'Proficient',
//         field: 'proficient_standard_count',
//         sortByField: 'proficient_standard_count',
//         className: 'proficient-column',
//         customCell: function(row) {
//           return <span>{row['proficient_standard_count']} standards</span>;
//         }
//       },
//       {
//         name: 'Not Yet Proficient',
//         field: 'not_proficient_standard_count',
//         sortByField: 'not_proficient_standard_count',
//         className: 'not-proficient-column',
//         customCell: function(row) {
//           return <span>{row['not_proficient_standard_count']} standards</span>;
//         }
//       },
//       {
//         name: 'Activities',
//         field: 'total_activity_count',
//         sortByField: 'total_activity_count',
//         className: 'activities-column',
//       },
//       {
//         name: 'Average',
//         field: 'average_score',
//         sortByField: 'average_score',
//         className: 'average-score-column',
//         customCell: function(row) {
//           return Math.round(row['average_score'] * 100) + '%';
//         }
//       },
//       {
//         name: 'Overall Mastery Status',
//         field: 'average_score',
//         sortByField: 'average_score',
//         className: 'overall-mastery-status-column',
//         customCell: function(row) {
//           return <MasteryStatus score={row['average_score']} />;
//         }
//       }
//     ];
//   },
//
//   sortDefinitions: function() {
//     return {
//       config: {
//         sorting_name: 'natural',
//         total_standard_count: 'numeric',
//         proficient_standard_count: 'numeric',
//         not_proficient_standard_count: 'numeric',
//         total_activity_count: 'numeric',
//         average_score: 'numeric'
//       },
//       default: {
//         field: 'sorting_name',
//         direction: 'asc'
//       }
//     };
//   },
//
//   onFetchSuccess: function(responseData) {
//     this.setState({
//       classroom: responseData.classroom
//     });
//   },
//
//   render: function() {
//     return (
//       <ProgressReport columnDefinitions={this.columnDefinitions}
//                          pagination={false}
//                          sourceUrl={this.props.sourceUrl}
//                          sortDefinitions={this.sortDefinitions}
//                          jsonResultsKey={'students'}
//                          exportCsv={'standards_classroom_students'}
//                          onFetchSuccess={this.onFetchSuccess}
//                          filterTypes={['unit']}
//                         premiumStatus={this.props.premiumStatus}>
//         <h2>Standards by Student: {this.state.classroom.name}</h2>
//       </ProgressReport>
//     );
//   }});
