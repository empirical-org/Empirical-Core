// The progress report shows all concepts for a given student.
import React from 'react'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import userIsPremium from '../modules/user_is_premium'
import { ReactTable, } from '../../../Shared/index'
import { requestGet, } from '../../../../modules/request/index'

export default class IndividualStudentConceptReport extends React.Component {

  constructor(props) {
    super()
    this.state = {
      loading: true,
      errors: false,
      userIsPremium: userIsPremium()
    }
  }

  componentDidMount() {
    requestGet(
      `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`,
      (body) => {
        this.setState({
          loading: false,
          errors: body.errors,
          reportData: body.concepts,
          studentName: body.student.name
        });
      }
    )
  }

  columns() {
    const blurIfNotPremium = this.state.userIsPremium ? null : 'non-premium-blur'
    return ([
      {
        Header: 'Category',
        accessor: 'level_2_concept_name',
        resizable: false,
        maxWidth: 200
      }, {
        Header: 'Name',
        accessor: 'concept_name',
        className: 'show-overflow',
        resizable: false,
      }, {
        Header: 'Questions',
        accessor: 'total_result_count',
        resizable: false,
        maxWidth: 120
      }, {
        Header: 'Correct',
        accessor: 'correct_result_count',
        resizable: false,
        className: blurIfNotPremium,
        maxWidth: 105
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false,
        className: blurIfNotPremium,
        maxWidth: 115
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false,
        className: blurIfNotPremium,
        Cell: ({row}) => row.original.percentage + '%',
        maxWidth: 120
      },
    ])
  }

  render() {
    if (this.state.loading || !this.state.reportData) {
      return <LoadingSpinner />
    }
    return (
      <div className='progress-reports-2018 concept-student-concepts' concept-student-concepts>
        <div className="meta-overview flex-row space-between">
          <div className='header-and-info flex-row vertically-centered'>
            <h1><span>Concept Results:</span> {this.state.studentName}</h1>
            <p>You can print this report by downloading a PDF file or export this data by downloading a CSV file.</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVDownloadForProgressReport data={this.state.reportData} studentName={this.state.studentName} />
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fas fa-long-arrow-alt-right" /></a>
          </div>
        </div>
        <div className='student-name'>{this.state.studentName}</div>
        <div key={`concepts-concepts-progress-report-length-${this.state.reportData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={this.state.reportData}
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
