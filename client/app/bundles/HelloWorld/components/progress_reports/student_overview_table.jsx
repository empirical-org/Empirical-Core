import React from 'react'
import _ from 'underscore'
import moment from 'moment'

export default class extends React.Component {
  //
  constructor(props) {
    super(props)
  }

  activityTableRowsAndAverageScore(unit) {
    const rows = [];
    let cumulativeScore = 0;
    let applicableScoreRowCount = 0;
    let averageScore;
    unit.forEach((row) => {
      if (row.percentage) {
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

  activityImage(activity_classification_id) {
    // i believe there is a module for this
    return activity_classification_id
  }

  completedStatus(row) {
    if (row.completed_at) {
      return moment.unix(row.completed_at).format('MM-DD-YYYY')
    }
  }

  greenArrow(row) {
    if (row.completed_at && ['6', '4'].indexOf(row.activity_classification.id === -1)) {
      return 'green arrow'
    }
  }

  score(row) {
    if (row.activity_classification_id === 'diagnostic' && row.completed_at) {
      return 'Completed'
    } else if (row.percentage) {
      return Math.round(row.percentage * 100) + '%'
    }
  }

  tableRow(row) {
    return (
      <tr>
        <td>{this.activityImage(row.activity_classification_id)}</td>
        <td>{row.name}</td>
        <td>{this.completedStatus(row)}</td>
        <td>{this.score(row)}</td>
        <td className='green-arrow'>{this.greenArrow(row)}</td>
      </tr>
    )
  }

  unitTable(unit) {
    const constantData = unit[0]
    const activityTableRowsAndAverageScore = this.activityTableRowsAndAverageScore(unit)
    const averageScore = activityTableRowsAndAverageScore.averageScore
    return (
      <div className='average-score'>
        <table className='student-overview-table'>
          <tbody>
            <tr className='header-row'>
              <th className='unit-name' colSpan='2'><div className='container flex-row vertically-centered'><div>{constantData.unit_name}</div></div></th>
              <th className='small-font'>Date Completed</th>
              <th className='small-font'>Score</th>
              <th className='average-score-container'>
                <div className='average-score-label'>
                  Average Score:
                </div>
                <div>
                  {averageScore
                    ? Math.round(averageScore * 100) + '%'
                    : 'N/A'}
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
