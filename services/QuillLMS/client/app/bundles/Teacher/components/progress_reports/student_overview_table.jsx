import React from 'react'
import _ from 'underscore'
import moment from 'moment'

import gradeColor from '../modules/grade_color.js'
import notLessonsOrDiagnostic from '../../../../modules/activity_classifications.js'
import userIsPremium from '../modules/user_is_premium'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium()
    }
  }

  activityImage(activity_classification_id, color) {
    if (color === 'unstarted') {
      return <div className={`icon-${color} icon-${activity_classification_id}-lightgray`} />
    }
    return <div className={`icon-${color} icon-${activity_classification_id}`} />
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
    } else if (row.activity_classification_id === '6' && row.is_a_completed_lesson === 't') {
      return 'Missed Lesson'
    }
    return 'Not Started'
  }

  greenArrow(row) {
    if (row.completed_at) {
      return (<a href={`/teachers/progress_reports/report_from_classroom_unit_activity_and_user/cu/${row.classroom_unit_id}/user/${this.props.studentId}/a/${row.activity_id}`}>
        <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
      </a>)
    }
  }

  score(row) {
    if (row.completed_at && !notLessonsOrDiagnostic(row.activity_classification_id)) {
      return {content: 'Not Scored', color: 'blue'}
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
    const scoreInfo = this.score(row);
    const blurIfNotPremium = this.state.userIsPremium ?  '' : 'non-premium-blur'
    const onClickFunction = row.completed_at ? () => window.location.href = `/teachers/progress_reports/report_from_classroom_unit_activity_and_user/cu/${row.classroom_unit_id}/user/${this.props.studentId}/a/${row.activity_id}` : () => {}

    return (
      <tr className={row.completed_at ? 'clickable' : ''} onClick={onClickFunction}>
        <td className='activity-image'>{this.activityImage(row.activity_classification_id, scoreInfo.color)}</td>
        <td className='activity-name'>
          <a className={scoreInfo.linkColor} href={`/activity_sessions/anonymous?activity_id=${row.activity_id}`}>{row.name}</a>
        </td>
        <td>{this.completedStatus(row)}</td>
        <td className={`score ${blurIfNotPremium}`}>{scoreInfo.content}</td>
        <td className='green-arrow'>{this.greenArrow(row)}</td>
      </tr>
    )
  }

  unitTable(unit) {
    const constantData = unit[0]
    const activityTableRowsAndAverageScore = this.activityTableRowsAndAverageScore(unit)
    const averageScore = activityTableRowsAndAverageScore.averageScore
    const blurIfNotPremium = this.state.userIsPremium ?  '' : 'non-premium-blur'
    return (
      <div className='average-score'>
        <table className='student-overview-table'>
          <tbody>
            <tr className='header-row'>
              <th className='unit-name' colSpan='2'>{constantData.unit_name}</th>
              <th className='small-font'>Date Completed</th>
              <th className='small-font'>Score</th>
              <th className='average-score-container'>
                <div className='average-score-label'>
                  Average Score:
                </div>
                <div className={`${blurIfNotPremium}`}>
                  {averageScore
                    ? Math.round(averageScore * 100) + '%'
                    : 'Not Scored'}
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
    const unitTableData = _.groupBy(this.props.reportData, (row) => row['unit_name']);
    const unitTables = _.map(unitTableData, (unit) => this.unitTable(unit));
    return (
      <div>
        {unitTables}
      </div >
    )
  }

}
