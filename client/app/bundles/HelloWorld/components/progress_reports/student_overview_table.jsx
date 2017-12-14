import React from 'react'
import _ from 'underscore'

export default class extends React.Component {
  //
	constructor(props){
		super(props)
	}

  activityTableRowsAndAverageScore(unit){
    const rows = [];
    let cumulativeScore = 0;
    let applicableScoreRowCount = 0;
    let averageScore;
    unit.forEach((row)=>{
      if (row.percentage) {
        cumulativeScore += parseFloat(row.percentage);
        applicableScoreRowCount += 1;
      }
      rows.push(
        this.tableRow(row)
      )
    })
    if (cumulativeScore > 0) {
      averageScore = cumulativeScore / applicableScoreRowCount
    }
    return {averageScore, rows}
  }

  activityImage(classification){
    // i believe there is a module for this
    return classification
  }

  completedStatus(row){
    return row.completed_at
  }

  furtherInfo(row){
    if (row.completed_at) {
      return 'green arrow'
    }
  }

  score(row){
    if (row.classification === 'diagnostic' && row.completed_at) {
      return 'Completed'
    } else if (row.percentage) {
      return Math.round(row.percentage * 100) + '%'
    }
  }

  tableRow(row){
    return (
      <tr>
        <td>{this.activityImage(row.classification)}</td>
        <td>{row.name}</td>
        <td>{this.completedStatus(row)}</td>
        <td>{this.score(row)}</td>
        <td>{this.furtherInfo(row)}</td>
      </tr>)
  }

  unitTable(unit){
    const constantData = unit[0]
    const activityTableRowsAndAverageScore = this.activityTableRowsAndAverageScore(unit)
    const averageScore = activityTableRowsAndAverageScore.averageScore
    return (
      <div>
        <div className='unit-info-container'>
          <div className='unit-name'>
            {constantData.unit_name}
          </div>
          <div className='average-score-container'>
            <div className='average-score-label'>
              Average Score:
            </div>
            <div>
              {averageScore ? Math.round(averageScore * 100) + '%' : ''}
            </div>
          </div>
          <div className='average-score'>
            <table className='student-overview-table'>
              <tbody>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Date Completed</th>
                  <th>Score</th>
                  <th></th>
                </tr>
                {activityTableRowsAndAverageScore.rows}
              </tbody>
            </table>
          </div>
        </div>

      </div>)
  }

	render() {
    const unitTableData = _.groupBy(this.props.reportData, (row)=>row['unit_name']);
    const unitTables = _.map(unitTableData, (unit)=>this.unitTable(unit));
    return (
      <div>
        {unitTables}
      </div>)
  }

}
