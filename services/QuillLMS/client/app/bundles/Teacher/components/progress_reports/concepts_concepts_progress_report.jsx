// The progress report shows all concepts for a given student.
import React from 'react'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'

import { requestGet, } from '../../../../modules/request/index'
import { ReactTable, ReportHeader, singleUserIcon, } from '../../../Shared/index'
import userIsPremium from '../modules/user_is_premium'
import LoadingSpinner from '../shared/loading_indicator.jsx'

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
        Cell: ({ row }) => <span className={blurIfNotPremium}>{row.original.correct_result_count}</span>,
        maxWidth: 105
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{row.original.incorrect_result_count}</span>,
        maxWidth: 115
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{row.original.percentage + '%'}</span>,
        maxWidth: 120
      },
    ])
  }

  render() {
    const { loading, reportData, studentName } = this.state
    const subHeaderElement = (
      <div className="student-badge">
        <img alt={singleUserIcon.alt} src={singleUserIcon.src} />
        <p>{studentName}</p>
      </div>
    )

    if (loading || !reportData) {
      return <LoadingSpinner />
    }


    return (
      <div className='teacher-report-container progress-reports-2018 concept-student-concepts'>
        <ReportHeader
          csvData={reportData}
          headerText="Concept Results:"
          subHeaderElement={subHeaderElement}
          tooltipText="You can print this report by downloading a PDF file or export this data by downloading a CSV file."
        />
        <div className='student-name'>{studentName}</div>
        <div key={`concepts-concepts-progress-report-length-${reportData.length}`}>
          <ReactTable
            className='progress-report has-green-arrow'
            columns={this.columns()}
            data={reportData}
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
