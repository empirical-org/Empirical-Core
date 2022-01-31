import React from 'react'
import _ from 'underscore'
import moment from 'moment'

import gradeColor from '../modules/grade_color.js'
import notLessonsOrDiagnostic from '../../../../modules/activity_classifications.js'
import userIsPremium from '../modules/user_is_premium'
import { Tooltip } from '../../../Shared/index'
import { getTimeSpent } from '../../helpers/studentReports'

export default class StudentOveriewTable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium()
    }
  }

  activityImage(activity_classification_id, color) {
    if (color === 'unstarted') {
      return <div className={`icon-wrapper icon-${color} icon-${activity_classification_id}-lightgray`} />
    }
    return <div className={`icon-wrapper icon-${color} icon-${activity_classification_id}`} />
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
      rows.push(this.tableRow(row))
    })
    if (cumulativeScore > 0) {
      averageScore = cumulativeScore / applicableScoreRowCount
    }
    return {averageScore, rows}
  }

  completedStatus(row) {
    if (row.completed_at) {
      return moment.unix(row.completed_at).format('MM-DD-YYYY')
    } else if (row.activity_classification_id === 6 && row.is_a_completed_lesson) {
      return 'Missed Lesson'
    }
    return 'Not Started'
  }

  greenArrow(row) {
    const { studentId } = this.props;
    if (row.completed_at) {
      return (
        <a href={`/teachers/progress_reports/report_from_classroom_unit_and_activity_and_user/cu/${row.classroom_unit_id}/user/${studentId}/a/${row.activity_id}`}>
          <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
        </a>
      )
    }
  }

  score(row) {
    if (row.completed_at && !notLessonsOrDiagnostic(row.activity_classification_id)) {
      return {content: 'Completed', color: 'blue'}
    } else if (row.percentage) {
      return {
        content: Math.round(row.percentage * 100) + '%',
        color: gradeColor(parseFloat(row.percentage)),
        linkColor: 'standard'
      }
    } else {
      return {content: undefined, color: 'unstarted'}
    }
  }

  tableRow(row) {
    const { studentId } = this.props;
    const { userIsPremium } = this.state;
    const scoreInfo = this.score(row);
    const onClickFunction = row.completed_at ? () => window.location.href = `/teachers/progress_reports/report_from_classroom_unit_and_activity_and_user/cu/${row.classroom_unit_id}/user/${studentId}/a/${row.activity_id}` : () => {}
    const blurIfNotPremium = userIsPremium ?  '' : 'non-premium-blur'
    return (
      <tr className={row.completed_at ? 'clickable' : ''} onClick={onClickFunction}>
        <td className='activity-image'>{this.activityImage(row.activity_classification_id, scoreInfo.color)}</td>
        <td className='activity-name'>
          <a className={scoreInfo.linkColor} href={`/activity_sessions/anonymous?activity_id=${row.activity_id}`}>{row.name}</a>
        </td>
        <td>{this.completedStatus(row)}</td>
        {this.scoreContent(scoreInfo, blurIfNotPremium)}
        <td className={`activity-timespent ${blurIfNotPremium}`}>{getTimeSpent(row.timespent)}</td>
        <td className='green-arrow'>{this.greenArrow(row)}</td>
      </tr>
    )
  }

  scoreContent(scoreInfo, blurIfNotPremium) {
    const activityUngraded = scoreInfo.content === 'Completed'
    if (activityUngraded) {
      return (
        <td className={`score ${blurIfNotPremium}`}>
          <Tooltip
            tooltipText="This type of activity is not graded."
            tooltipTriggerText={scoreInfo.content}
          />
        </td>
      )
    } else {
      return (
        <td className={`score ${blurIfNotPremium}`}>{scoreInfo.content}</td>
      )
    }
  }

  unitTable(unit) {
    const { userIsPremium } = this.state;
    const constantData = unit[0]
    const activityTableRowsAndAverageScore = this.activityTableRowsAndAverageScore(unit)
    const averageScore = activityTableRowsAndAverageScore.averageScore
    const blurIfNotPremium = userIsPremium ?  '' : 'non-premium-blur'
    return (
      <div className='average-score'>
        <table className='student-overview-table'>
          <tbody>
            <tr className='header-row'>
              <th className='unit-name' colSpan='2'>{constantData.unit_name}</th>
              <th className='small-font'>Date completed</th>
              <th className='small-font'>Score</th>
              <th className='small-font'>Time spent</th>
              <th className='average-score-container'>
                <div className='average-score-label'>
                  Average score:
                </div>
                <div className={`${blurIfNotPremium}`}>
                  {averageScore
                    ? Math.round(averageScore * 100) + '%'
                    : <Tooltip
                      tooltipText="This type of activity is not graded."
                      tooltipTriggerText="N/A"
                    />}
                </div>
              </th>
            </tr>
            {activityTableRowsAndAverageScore.rows}
          </tbody>
        </table>
      </div>
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
