import Pluralize from 'pluralize';
import React from 'react';

import ScoreColor from '../../modules/score_color.js';

export default class OverviewBoxes extends React.Component {
  componentDidMount() {
    this.countBoxType();
  }

  countBoxType = () => {
    const { data, } = this.props
    let count = {};
    let scoreColor;

    data.forEach(student => {
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
      range = '0 - 31%';
      proficiency = 'Rarely demonstrated skill'
    } else if (group === 'yellow-score-color') {
      range = '32 - 82%';
      proficiency = 'Sometimes demonstrated skill'
    } else {
      range = '83 - 100%';
      proficiency = 'Frequently demonstrated skill'
    }
    return (
      <div className={'student-groupings ' + group} key={group}>
        <h3>{(count || 0) + ' ' + Pluralize('Student', count)}</h3>
        <span>{group === 'blue-score-color' ? 'Completed' : `${range} | ${proficiency}`}</span>
      </div>
    )
  };

  groupingBoxes = () => {
    // need to list the keys in an array instead of just using a for in
    // loop as we want them in this particular order
    let groupCounts = this.countBoxType();
    let groups = ['red', 'yellow', 'green', 'blue'];
    return groups.map(group => {
      group += '-score-color'
      return this.boxCreator(group, groupCounts[group])
    })
  };

  render() {
    return <div id='student-groupings-wrapper'>{this.groupingBoxes()}</div>
  }
}
