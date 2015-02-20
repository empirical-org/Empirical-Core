EC.SortableTr = React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired
  },

  tds: function() {
    return _.map(this.props.columns, function (column, i) {
      return <td key={i}>{this.props.row[column.field]}</td>;
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