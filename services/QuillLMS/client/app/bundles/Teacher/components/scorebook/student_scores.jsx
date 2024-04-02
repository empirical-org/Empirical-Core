import React from 'react';

import shouldCountForScoring from '../../../../modules/activity_classifications.js';
import { getTimeSpent } from '../../helpers/studentReports';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';

export const StudentScores = ({ data, premium_state }) => {
  function calculateAverageScore() {
    let totalScore = 0;
    let relevantScores = 0;
    data.scores.forEach(score => {
      if(shouldCountForScoring(score.activity_classification_id) && score.percentage) {
        relevantScores += 1;
        totalScore += parseFloat(score.percentage);
      }
    });
    const averageScore = totalScore / relevantScores;
    if(averageScore) {
      return (
        <div className="average-score">
          <span className="data">{Math.round(averageScore * 100)}%</span>
          <span className="data-label">Average score</span>
        </div>
      )
      return `${Math.round(averageScore * 100)}% Avg. score`;
    }

    return null
  }

  function calculateTotalTimeSpent() {
    const { scores } = data;
    const totalTimeSpent = scores.reduce((previousValue, score) => {
      return score.timespent ? previousValue += score.timespent : previousValue;
    }, 0);
    if(totalTimeSpent) {
      return (
        <div className="time-spent">
          <span className="data">{getTimeSpent(totalTimeSpent)}</span>
          <span className="data-label">Total time spent</span>
        </div>

      )
    }
    return null;
  }

  function handleScores() {
    return data.scores.map((score, index) => <ActivityIconWithTooltip context='scorebook' data={score} key={`${data.name} ${index} ${score.cuId}`} premium_state={premium_state} />);
  }
  /* eslint-disable react/jsx-no-target-blank */
  const activityScoresLink = <a className="focus-on-light activity-scores-link" href={`/teachers/progress_reports/student_overview?student_id=${data.userId}&classroom_id=${data.classroomId}`} target="_blank">View activity scores <img alt="" src={`${process.env.CDN_URL}/images/icons/yellow-diamond.svg`} /></a>
  /* eslint-enable react/jsx-no-target-blank */

  const timeSpentElement = calculateTotalTimeSpent()
  const averageScoreElement = calculateAverageScore()

  return (
    <section className="overview-section">
      <header className="student-header">
        <h3 className="student-name">{data.name}</h3>
        {timeSpentElement}
        {timeSpentElement && averageScoreElement ? <div className="vertical-divider" /> : null}
        {averageScoreElement}
        {activityScoresLink}
      </header>
      <div className="flex-row vertically-centered">
        {handleScores()}
      </div>
    </section>
  );
}

export default StudentScores
