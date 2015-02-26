// Ported from EC.ActivitySearchSort
EC.SortableTh = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string.isRequired,
    sortHandler: React.PropTypes.func.isRequired // Handle sorting of columns
  },

  getInitialState: function() {
    return {
      sortDirection: 'asc'
    };
  },

  arrowClass: function() {
    return this.state.sortDirection === 'desc' ? 'fa fa-caret-down' : 'fa fa-caret-up';
  },

  clickSort: function() {
    // Toggle the sort direction.
    var newDirection = (this.state.sortDirection === 'asc') ? 'desc' : 'asc';
    this.setState({sortDirection: newDirection}, function() {
      this.props.sortHandler(newDirection);
    });
  },

  render: function() {
    return (
      <th className="sorter" onClick={this.clickSort}>
        {this.props.displayName}
        <i className={this.arrowClass()}></i>
      </th>
    );
  }
});