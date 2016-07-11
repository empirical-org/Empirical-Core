// This React mixin handles client-side sorting.
// Use it ljke so:
// Call defineSorting() in componentDidMount() of your component.
// Call sortResults() when a sort changes (use as a handler function)
// Call applySorting() on your data before displaying it in render().
import React from 'react'
import _ from 'underscore'
import naturalCmp from 'underscore.string/naturalCmp'




export default {
  getInitialState: function() {
    return {
      currentSort: {},
      sortConfig: {}
    };
  },

  // Sign = 1 or -1 depending on whether the sort is normal or reverse order
  numericSort: function(sign, fieldName, a, b) {
    return (a[fieldName] - b[fieldName]) * sign;
  },

  // Sign = 1 or -1 depending on whether the sort is normal or reverse order
  naturalSort: function(sign, fieldName, a, b) {
    return s.naturalCmp(a[fieldName], b[fieldName]) * sign;
  },

  // config = {field: string, sortFunc: function, ...}
  // currentSort = {field: string, direction: string ('asc' or 'desc')}
  defineSorting: function(config, currentSort) {
    // Convert string configuration to functions.
    _.each(config, function(value, key) {
      if (!_.isFunction(value)) {
        switch(value) {
          case 'numeric':
            config[key] = this.numericSort;
            break
          case 'natural':
            config[key] = this.naturalSort;
            break;
          default:
            throw "Sort function named '" + value + "' not recognized";
        }
      }
    }.bind(this));

    this.setState({
      sortConfig: config,
      currentSort: currentSort
    });
  },

  applySorting: function(results) {
    var sortDirection = this.state.currentSort.direction,
        sortByFieldName = this.state.currentSort.field;
    if (!sortDirection && !sortByFieldName) {
      return results;
    }
    // Flip the sign of the return value to sort in reverse
    var sign = (sortDirection === 'asc' ? 1 : -1);

    var sortFunc = this.state.sortConfig[sortByFieldName];

    if (!sortFunc) {
      throw "Sort function not defined for '" + sortByFieldName + "' field";
    }

    // Partially apply arguments so that the new func has signature -> (a, b)
    var appliedSort = _.partial(sortFunc, sign, sortByFieldName);
    results.sort(appliedSort);
    return results;
  },

  sortResults: function(after, sortByFieldName, sortDirection) {
    this.setState({
      currentSort: {
        field: sortByFieldName,
        direction: sortDirection
      }
    }, after);
  }
};
