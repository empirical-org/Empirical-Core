import _ from 'underscore'
import React from 'react'

export default React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired
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

  render: function() {
    return (
      <tr>
        {this.tds()}
      </tr>
    );
  }
});
