import Pluralize from 'pluralize';
import React from 'react';
import ScoreColor from '../../modules/score_color.js';

export default class OverviewBoxes extends React.Component {
  componentDidMount() {
    this.countBoxType();
  }

  countBoxType = () => {
    let count = {};
    let scoreColor;
    this.props.data.forEach(student => {
      scoreColor = ScoreColor(student.score);
      count[scoreColor] = count[scoreColor] || 0;
      count[scoreColor] += 1;
    })
    return count;
  };

  boxCreator = (group, count) => {
    let range,
      proficiency
    if (group === 'red-score-color') {
      range = '0 - 59%';
      proficiency = 'Not yet proficient'
    } else if (group === 'yellow-score-color') {
      range = '60 - 79%';
      proficiency = 'Nearly proficient'
    } else {
      range = '80 - 100%';
      proficiency = 'Proficient'
    }
    return (
      <div className={'student-groupings ' + group} key={group}>
        <h3>{(count || 0) + ' ' + Pluralize('Student', count)}</h3>
        <span>{range + '  |  ' + proficiency}</span>
      </div>
    )
  };

  groupingBoxes = () => {
    // need to list the keys in an array instead of just using a for in
    // loop as we want them in this particular order
    let groupCounts = this.countBoxType();
    let groups = ['red', 'yellow', 'green'];
    return groups.map(group => {
      group += '-score-color'
      return this.boxCreator(group, groupCounts[group])
    })
  };

  render() {
    return <div id='student-groupings-wrapper'>{this.groupingBoxes()}</div>
  }
}
