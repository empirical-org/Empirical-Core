import React from 'react';
import _ from 'underscore';
import ScoreColor from '../../../modules/score_color.js';

export default class SortableTr extends React.Component {
  contentForColumn = (column) => {
    if (typeof column.customCell === 'function') {
      return column.customCell(this.props.row);
    } else {
      return this.props.row[column.field];
    }
  };

  tds = () => {
    return _.map(this.props.columns, function (column, i) {
      return <td key={i}>{this.contentForColumn(column)}</td>;
    }, this);
  };

  trClassName = () => {
    let score = Object.assign({},this.props.row)
    let keys = this.props.colorByScoreKeys
    if (keys) {
      keys.forEach( key => score = score[key])
      return ScoreColor(score)
    }
  };

  render() {
    return (
      <tr className={this.trClassName()}>
        {this.tds()}
      </tr>
    );
  }
}
