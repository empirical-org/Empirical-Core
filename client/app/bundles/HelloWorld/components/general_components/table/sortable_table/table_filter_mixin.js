import React from 'react'
import _ from 'underscore'


export default {
  getInitialState: function() {
    return {
      currentFilters: {}
    };
  },

  // Only call this function when doing client-side filtering.
  // Server-side filtering should be done by passing parameters
  // to your AJAX fetch.
  applyFilters: function(results) {
    var visibleResults = results;

    _.each(this.state.currentFilters, function(value, fieldName) {
      if (!!value) {
        var filterCriteria = {};
        filterCriteria[fieldName] = value;
        visibleResults = _.where(visibleResults, filterCriteria);
      }
    });
    return visibleResults;
  },

  filterByField: function(fieldName, value, next) {
    // Set the filter state.
    var newState = this.state.currentFilters;
    newState[fieldName] = value;
    this.setState(newState, next);
  },

  // Abstract helper for the other populate functions
  getFilterOptions: function(results, nameField, valueField, allOptionName) {
    // Grab and uniq all options based on the value (classroom ID).
    var allNames = _.chain(results).map(function(result) {
      return {
        name: result[nameField],
        value: result[valueField]
      };
    }).uniq(false, function(option) {
      return option.value;
    }).reject(function(option) {
      return option.value === null;
    }).value();
    allNames.unshift({name: allOptionName, value: ''});
    return allNames;
  }
};
