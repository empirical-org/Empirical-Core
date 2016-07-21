import React from 'react'
import TotalScore from '../../../general_components/tooltip/total_score.jsx'
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx'

export default function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var totalScoreOrNot;
    if (data.percentage == null) {
      totalScoreOrNot = null
    } else {
      totalScoreOrNot = <TotalScore percentage={_displayPercentage(data.percentage)} />
    }

    return React.renderToString(
      <div className='student-profile-tooltip'>
        <div className='title'>
          ACTIVITY RESULTS
        </div>
        <div className='main'>
          {totalScoreOrNot}
          <ActivityDetails data={data} />
        </div>
      </div>
    );
  }
}
