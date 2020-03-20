import _ from 'underscore'
import PropTypes from 'prop-types';
import React from 'react'
import ScoreColor from '../../../modules/score_color.js'

export default class extends React.Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    colorByScoreKeys: PropTypes.array
  };

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
