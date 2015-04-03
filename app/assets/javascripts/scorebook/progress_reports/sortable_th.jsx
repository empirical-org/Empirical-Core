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
    if (_.isEmpty(this.props.displayName)) {
      return;
    }
    // Toggle the sort direction.
    var newDirection = (this.state.sortDirection === 'asc') ? 'desc' : 'asc';
    this.setState({sortDirection: newDirection}, function() {
      this.props.sortHandler(newDirection);
    });
  },

  render: function() {
    var arrow;
    if (!_.isEmpty(this.props.displayName)) {
      arrow = <i className={this.arrowClass()}></i>;
    }
    return (
      <th className="sorter" onClick={this.clickSort}>
        {this.props.displayName}
        {arrow}
      </th>
    );
  }
});