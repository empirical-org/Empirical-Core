// The progress report shows all concepts for a given student.
import React from 'react'
import request from 'request'
import ReactTable from 'react-table'

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import 'react-table/react-table.css'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import userIsPremium from '../modules/user_is_premium'

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
      that.setState({loading: false, errors: body.errors, reportData: data.concepts, studentName: data.student.name});
    });
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Category',
        accessor: 'level_2_concept_name',
        resizable: false,
        width: 200
      }, {
        Header: 'Name',
        accessor: 'concept_name',
        resizable: false,
      }, {
        Header: 'Questions',
        accessor: 'total_result_count',
        resizable: false,
        width: 120
      }, {
        Header: 'Correct',
        accessor: 'correct_result_count',
        resizable: false,
        className: blurIfNotPremium,
        width: 120
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false,
        className: blurIfNotPremium,
        width: 120
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false,
        className: blurIfNotPremium,
        Cell: props => props.value + '%',
        width: 120
      },
    ])
  }

  render() {
    if (this.state.loading || !this.state.reportData) {
      return <LoadingSpinner />
    }
    return (
      <div className='progress-reports-2018 concept-student-concepts' concept-student-concepts>
        <a className='navigate-back' href="/teachers/progress_reports/concepts/students"><img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />Back to Concept Results</a>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info flex-row vertically-centered'>
            <h1><span>Concept Results:</span> {this.state.studentName}</h1>
            <p>You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.reportData} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div key={`concepts-concepts-progress-report-length-${this.state.reportData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={this.state.reportData}
            defaultPageSize={this.state.reportData.length}
            defaultSorted={[{
              id: 'total_result_count',
              desc: true
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
