import React from 'react';
import ConceptResultStat from './concept_result_stat.jsx';
import $ from 'jquery';

export default class ConceptResultStats extends React.Component {
  addTotalAndPercentageToConRes = (conResArr) => {
    conResArr.forEach((conRes) => {
      conRes.total = conRes.incorrect + conRes.correct;
      conRes.percentage = conRes.correct / conRes.total;
    });
  };

  sortedStats = (statsAsArr) => {
    return statsAsArr.sort((conRes1, conRes2) => {
      this.addTotalAndPercentageToConRes([conRes1, conRes2]);
      if (conRes1.total !== conRes2.total) {
        return conRes2.total - conRes1.total;
      }
      // then sort by percentage
      if (conRes1.percentage !== conRes2.percentage) {
        return conRes2.percentage - conRes1.percentage;
      }
      // finally, sort alphabetically
      return conRes2.name < conRes1.name;
    });
  };

  statsRows = () => {
    const statsRows = [];
    const stats = this.calculateStats();
    // loop through to the end of the array or 9. which ever is less
    const maxNumOfResults = stats.length > 10 ? 10 : stats.length;
    for (let i = 0; i < maxNumOfResults; i++) {
      const statsRow = stats[i];
      statsRows.push(<ConceptResultStat
        correct={statsRow.correct}
        incorrect={statsRow.incorrect}
        key={statsRow.name}
        name={statsRow.name}
      />);
    }
    const additionalInfoRow = this.additionalInfoRow(statsRows.length, stats.length);
    return statsRows.concat(additionalInfoRow);
  };

  additionalInfoRow = (statsRowsLen, statsLen) => {
    let message;
    const lengthDiff = statsLen - statsRowsLen;
    if (lengthDiff > 0) {
      message = `+ ${lengthDiff} additional concepts in the activity report.`;
    } else if (statsRowsLen) {
      message = 'Clicking on the activity icon loads the report.';
    }
    return (
      <div key="link_to_report">
        <div className="tooltip-message">{message}</div>
      </div>
    );
  };

  objectToArray = (calculatedStats) => {
    return $.map(calculatedStats, (value, index) => [value]);
  };

  calculateStats = () => {
    const stats = this.props.results.reduce((memo, conceptResult) => {
      const statsRow = memo[conceptResult.name] || {
        name: conceptResult.name,
        correct: 0,
        incorrect: 0,
      };
      memo[conceptResult.name] = statsRow;
      const correct = parseInt(conceptResult.correct);
      if (correct) {
        statsRow.correct += 1;
      } else {
        statsRow.incorrect += 1;
      }
      return memo;
    }, {});
    const statsAsArr = this.objectToArray(stats);
    const sortedStats = this.sortedStats(statsAsArr);
    return sortedStats;
  };

  render() {
    return (
      <div className="concept-stats container">
        {this.statsRows()}
      </div>
    );
  }
}
