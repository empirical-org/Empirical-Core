import _ from 'underscore';

export default {
  getInitialState() {
    return {
      currentFilters: {},
    };
  },

  // Only call this function when doing client-side filtering.
  // Server-side filtering should be done by passing parameters
  // to your AJAX fetch.
  applyFilters(results) {
    let visibleResults = results;

    _.each(this.state.currentFilters, (value, fieldName) => {
      if (value) {
        const filterCriteria = {};
        filterCriteria[fieldName] = value;
        visibleResults = _.where(visibleResults, filterCriteria);
      }
    });
    return visibleResults;
  },

  filterByField(fieldName, value, next) {
    // Set the filter state.
    const newState = this.state.currentFilters;
    newState[fieldName] = value;
    this.setState(newState, next);
  },

  // Abstract helper for the other populate functions
  getFilterOptions(results, nameField, valueField, allOptionName) {
    // Grab and uniq all options based on the value (classroom ID).
    const allNames = _.chain(results).map(result => ({
      name: result[nameField],
      value: result[valueField],
      label: result[nameField]
    })).uniq(false, option => option.value).reject(option => option.value === null).value();
    allNames.unshift({ name: allOptionName, value: '', label: allOptionName, });
    return allNames;
  },
};
