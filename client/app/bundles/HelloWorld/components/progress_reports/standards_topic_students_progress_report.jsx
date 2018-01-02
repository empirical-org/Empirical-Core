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
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`
    }, (e, r, body) => {
      const data = JSON.parse(body)
      const studentData = this.formattedStudentData(data.students)
      const csvData = this.formatDataForCSV(data.students)
      const topic = data.topics[0]
      that.setState({loading: false, errors: body.errors, studentData, csvData, topic});
    });
  }

  formattedStudentData(data) {
    return data.map((row) => {
      row.name = row.name
      row.total_activity_count = Number(row.total_activity_count)
      row.average_score = Number(row.average_score * 100)
      row.proficiency_status = row.proficiency_status
      row.green_arrow = (
        <a className='green-arrow' href={row.student_topics_href}>
          <img src="https://assets.quill.org/images/icons/chevron-dark-green.svg" alt=""/>
        </a>
      )
      return row
    })
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
          <span><span className={row.original['mastery_status'] === 'Proficient' ? 'proficient-indicator' : 'not-proficient-indicator'}/>{row.original['mastery_status']}</span>
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

  render() {
    console.log('indivudal standards file')
    if (this.state.loading || !this.state.studentData) {
      return <LoadingSpinner/>
    }
    return (
      <div className='progress-reports-2018 individual-standard'>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info'>
            <h1><span>Standards Report:</span> {this.state.topic.name}</h1>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.csvData}/>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right"></i></a>
          </div>
        </div>
        <div key={`concept-progress-report-length-${this.state.studentData.length}`}>
          <ReactTable data={this.state.studentData} columns={this.columns()} showPagination={false} defaultSorted={[{
              id: 'name',
              desc: false
            }
          ]} showPaginationTop={false} showPaginationBottom={false} showPageSizeOptions={false} defaultPageSize={this.state.studentData.length} className='progress-report has-green-arrow'/>
        </div>
      </div>
    )
  }

};

// 'use strict';
// import React from 'react'
// import ProgressReport from './progress_report.jsx'
// import MasteryStatus from './mastery_status.jsx'
//
//
// export default  React.createClass({
//   propTypes: {
//     sourceUrl: React.PropTypes.string.isRequired,
//     premiumStatus: React.PropTypes.string.isRequired
//   },
//
//   getInitialState: function() {
//     return {
//       topic: {}
//     };
//   },
//
//   columnDefinitions: function() {
//     return [
//       {
//         name: 'Student Name',
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
//         name: 'Activities',
//         field: 'total_activity_count',
//         sortByField: 'total_activity_count',
//         className: 'activities-column'
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
//         name: 'Mastery Status',
//         field: 'average_score',
//         sortByField: 'average_score',
//         className: 'average-score-column',
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
//     if (responseData.topics && responseData.topics.length) {
//       this.setState({
//         topic: responseData.topics[0]
//       });
//     }
//   },
//
//   render: function() {
//     console.log('this is the individual standard file')
//     return (
//       <ProgressReport columnDefinitions={this.columnDefinitions}
//                          pagination={false}
//                          sourceUrl={this.props.sourceUrl}
//                          sortDefinitions={this.sortDefinitions}
//                          jsonResultsKey={'students'}
//                          exportCsv={'standards_topic_students'}
//                          onFetchSuccess={this.onFetchSuccess}
//                          filterTypes={['unit']}
//                          premiumStatus={this.props.premiumStatus}>
//         <h2>Standard: {this.state.topic.name}</h2>
//       </ProgressReport>
//     );
//   }
// });
