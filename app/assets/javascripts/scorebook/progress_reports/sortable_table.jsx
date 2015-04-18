EC.SortableTable = React.createClass({
  propTypes: {
    currentSort: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired, // [{classification_name: 'foobar', ...}]
    sortHandler: React.PropTypes.func.isRequired // Handle sorting of columns
  },

  // Return a handler function that includes the field name as the 1st arg.
  sortByColumn: function(fieldName) {
    return _.bind(function sortHandler(sortDirection) {
      return this.props.sortHandler(fieldName, sortDirection);
    }, this);
  },

  columns: function() {
    return _.map(this.props.columns, function (column, i) {
      var isCurrentSort = (column.sortByField === this.props.currentSort.field);
      return <EC.SortableTh key={i}
                            sortHandler={this.sortByColumn(column.sortByField)}
                            displayName={column.name}
                            displayClass={column.className}
                            sortDirection={this.props.currentSort.direction || 'asc'}
                            isCurrentSort={isCurrentSort} />
    }, this);
  },

  rows: function() {
    return _.map(this.props.rows, function(row, i) {
      return <EC.SortableTr key={row.id || i} row={row} columns={this.props.columns} />
    }, this);
  },

  render: function() {
    return (
      <table className='table'>
        <thead>
          <tr>
            {this.columns()}
          </tr>
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    );
  }
});
