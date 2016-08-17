import _ from 'underscore'
import React from 'react'
import ScoreColor from '../../../modules/score_color.js'

export default React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    colorByScore: React.PropTypes.bool
  },

  contentForColumn: function(column) {
    if (typeof column.customCell === 'function') {
      return column.customCell(this.props.row);
    } else {
      return this.props.row[column.field];
    }
  },

  tds: function() {
    return _.map(this.props.columns, function (column, i) {
      return <td key={i}>{this.contentForColumn(column)}</td>;
    }, this);
  },

  trClassName: function(){
    let classy = '';
    if (this.props.colorByScore) {
      classy += ScoreColor(this.props.row.score)
    }
    return classy
  },



  render: function() {
    return (
      <tr className={this.trClassName()}>
        {this.tds()}
      </tr>
    );
  }
});
