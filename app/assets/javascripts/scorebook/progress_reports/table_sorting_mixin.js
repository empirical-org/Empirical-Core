EC.TableSortingMixin = {
  getInitialState: function() {
    return {
      currentSort: {
        field: 'activity_classification_name',
        direction: 'asc'
      }
    };
  },

  applySorting: function(results) {
    var sortDirection = this.state.currentSort.direction,
        sortByFieldName = this.state.currentSort.field;
    // Flip the sign of the return value to sort in reverse
    var sign = (sortDirection === 'asc' ? 1 : -1);

    var sortFunc;
    switch(sortByFieldName) {
      case 'completed_at':
      case 'percentage':
      case 'time_spent':
        // Integer sort
        sortFunc = function(a, b) {
          return (a - b) * sign;
        };
      case 'activity_classification_name':
      case 'activity_name':
      case 'standard':
      default:
        // Alphanumeric sort
        sortFunc = function(a, b) {
          return s.naturalCmp(a[sortByFieldName], b[sortByFieldName]) * sign;
        };
    }

    results.sort(sortFunc);
    return results;
  },

  sortResults: function(sortByFieldName, sortDirection) {
    this.setState({
      currentSort: {
        field: sortByFieldName,
        direction: sortDirection
      }
    });
  },
};