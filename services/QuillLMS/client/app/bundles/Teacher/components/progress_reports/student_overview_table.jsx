import moment from 'moment'
import React from 'react'
import _ from 'underscore'

import notLessonsOrDiagnostic from '../../../../modules/activity_classifications.js'
import { ReactTable, Tooltip, accountGreenIcon } from '../../../Shared/index'
import { getTimeSpent, renderTooltipRow } from '../../helpers/studentReports'
import userIsPremium from '../modules/user_is_premium'

export default class StudentOveriewTable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium()
    }
  }

  activityTableRowsAndAverageScore(unit) {
    const rows = [];
    let cumulativeScore = 0;
    let applicableScoreRowCount = 0;
    let averageScore;
    unit.forEach((row) => {
      if (row.percentage && notLessonsOrDiagnostic(row.activity_classification_id)) {
        cumulativeScore += parseFloat(row.percentage);
        applicableScoreRowCount += 1;
      }
      rows.push(row)
    })
    if (cumulativeScore > 0) {
      averageScore = cumulativeScore / applicableScoreRowCount
    }
    return { averageScore, rows }
  }

  completedStatus(row) {
    if (row.completed_at) {
      return moment.unix(row.completed_at).format('MM-DD-YYYY')
    } else if (row.activity_classification_id === 6 && row.is_a_completed_lesson) {
      return 'Missed Lesson'
    }
    return 'Not Started'
  }

  score(row) {
    if (row.completed_at && !notLessonsOrDiagnostic(row.activity_classification_id)) {
      return 'Completed'
    } else if (row.percentage) {
      return Math.round(row.percentage * 100) + '%'
    } else {
      return 'Not Started'
    }
  }

  columns() {
    const { userIsPremium } = this.state;
    const { studentId } = this.props
    const blurIfNotPremium = userIsPremium ? null : 'non-premium-blur'
    const activityNameHeaderWidth = 660
    return ([
      {
        Header: 'Activity',
        accessor: 'name',
        resizable: false,
        maxWidth: activityNameHeaderWidth,
        Cell: ({ row }) => {
          const { original } = row
          const { id, name, classroom_unit_id, completed_at } = original
          const link = completed_at ? `/teachers/progress_reports/report_from_classroom_unit_and_activity_and_user/cu/${classroom_unit_id}/user/${studentId}/a/${row.activity_id}` : null
          return renderTooltipRow({ icon: accountGreenIcon, id, label: name, link, headerWidth: activityNameHeaderWidth })
        },
      }, {
        Header: 'Date Completed',
        accessor: 'completed_at',
        resizable: false,
        maxWidth: 180,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{this.completedStatus(row.original)}</span>,
      }, {
        Header: 'Overall Score',
        accessor: 'percentage',
        resizable: false,
        maxWidth: 180,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{this.score(row.original)}</span>,
      }, {
        Header: 'Time Spent',
        accessor: 'timespent',
        resizable: false,
        maxWidth: 180,
        Cell: ({ row }) => <span className={blurIfNotPremium}>{getTimeSpent(row.original.timespent)}</span>,
      },
    ])
  }

  unitTable(unit) {
    const { userIsPremium } = this.state;
    const activityTableRowsAndAverageScore = this.activityTableRowsAndAverageScore(unit)
    const { rows, averageScore } = activityTableRowsAndAverageScore
    const blurIfNotPremium = userIsPremium ? '' : 'non-premium-blur'
    return (
      <React.Fragment>
        <div className="unit-header-container">
          <p className="unit-name">{unit[0].unit_name}</p>
          <div className='average-score-container'>
            <div className={`score-value ${blurIfNotPremium}`}>
              {averageScore
                ? Math.round(averageScore * 100) + '%'
                : <Tooltip
                  tooltipText="This type of activity is not graded."
                  tooltipTriggerText="N/A"
                />}
            </div>
            <p className='average-score-label'>Average score</p>
          </div>
        </div>
        <ReactTable
          className='progress-report has-green-arrow'
          columns={this.columns()}
          data={rows}
          defaultSorted={[{
            id: 'completed_at',
            desc: true
          }
          ]}
        />
      </React.Fragment>
    )
  }

  render() {
    const { reportData } = this.props;
    const unitTableData = _.groupBy(reportData, (row) => row['unit_name']);
    const unitTables = _.map(unitTableData, (unit) => this.unitTable(unit));
    return (
      <div>
        {unitTables}
      </div >
    )
  }
}
