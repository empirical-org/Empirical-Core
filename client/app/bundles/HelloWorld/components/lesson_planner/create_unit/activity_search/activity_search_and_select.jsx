'use strict'

 import React from 'react'
 import _ from 'underscore'
 import $ from 'jquery'
 import SearchActivitiesInput from './search_activities_input'
 import ActivitySearchFilters from './activity_search_filters/activity_search_filters'
 import ActivitySearchFilterConfig from './activity_search_filters/activity_search_filter_config'
 import ActivitySearchSort from './activity_search_sort/activity_search_sort'
 import ActivitySearchSortConfig from './activity_search_sort/activity_search_sort_config'
 import ActivitySearchSorts from './activity_search_sort/activity_search_sorts'
 import ActivitySearchResults from './activity_search_results/activity_search_results'
 import Pagination from './pagination/pagination'
 import SelectedActivities from './selected_activities/selected_activities'


 export default  React.createClass({
  propTypes: {
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    clickContinue: React.PropTypes.func.isRequired,
    isEnoughInputProvidedToContinue: React.PropTypes.bool.isRequired,
    errorMessage: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      activitySearchResults: [],
      currentPageSearchResults: [],
      currentPage: 1,
      searchQuery: '',
      numberOfPages: 1,
      resultsPerPage: 12,
      maxPageNumber: 4,
      allFilterOptions: {
        'activity_classification': [],
        'section': [],
        'topic_category': []
      },
      filters: ActivitySearchFilterConfig,
      sorts: ActivitySearchSortConfig
    }
  },

  componentDidMount: function () {
    this.searchRequest();
  },

  searchRequest: function () {
    $.ajax({
      url: '/activities/search',
      context: this,
      data: this.searchRequestData(),
      success: this.searchRequestSuccess,
      dataType: 'json',
      error: function () {
        console.log('error searching activities');
      }
    });
  },

  searchRequestData: function() {
    var filters = this.state.filters.map(function(filter) {
      return {
        field: filter['field'],
        selected: filter['selected']
      }
    });

    var currentSort;
    _.each(this.state.sorts, function(sort) {
      if (sort.selected) {
        currentSort = {
          field: sort['field'],
          asc_or_desc: sort['asc_or_desc']
        };
      }
    });

    return {
        search: {
          search_query: this.state.searchQuery,
          filters: filters,
          sort: currentSort,
        }
      }
  },

  searchRequestSuccess: function (data) {
    var hash = {
      activitySearchResults: data.activities,
      numberOfPages: data.number_of_pages,
      currentPage: 1
    };

    this.setInitialFilterOptions(data);
    this.setState(hash, this.updateFilterOptionsAfterRequest);
  },

  setInitialFilterOptions: function(data) {
    // If the filter options have set already, do not override them.
    var allEmpty = _.all(this.state.allFilterOptions, function(options, field) {
      return options.length === 0;
    });
    if (!allEmpty) {
      return;
    }

    var newOptions = {};
    _.each(this.state.allFilterOptions, function(options, field) {
      var key = this.pluralize(field);
      newOptions[field] = data[key];
    }, this);
    this.setState({allFilterOptions: newOptions});
  },

  updateFilterOptionsAfterRequest: function() {
    // Go through all the filters,
    // For each filter that is not currently selected,
    // only display the options that are available based on the set
    // of activity results that have been returned from the server.
    // Otherwise, selected filters will display all available options.
    var availableOptions = this._findFilterOptionsBasedOnActivities();

    var newFilters = this.state.filters;
    newFilters.forEach(function (filter) {
      if (filter.selected) {
        filter.options = this.state.allFilterOptions[filter.field];
      } else {
        filter.options = availableOptions[filter.field];
      }
    }, this);
    this.setState({filters: newFilters});
  },

  // Return a hash of the filter options that are available based on the activities
  // that were returned in the search results.
  _findFilterOptionsBasedOnActivities: function() {
    // This function works like so:
    // Gather all the IDs for properties of the activity that can be filtered.
    // Create a unique set of those IDs (optimization).
    // Go through the sets of filter options returned from the server and remove
    // them from the list of available options if their IDs are not referenced
    // by any of the activities.
    // Return the remaining list.

    var activityClassificationIds = [], topicCategoryIds = [], sectionIds = [];
    _.each(this.state.activitySearchResults, function(activity) {
      activityClassificationIds.push(activity.classification.id);
      topicCategoryIds.push(activity.topic.topic_category.id);
      if (activity.topic.section) {
        sectionIds.push(activity.topic.section.id);
      }
    });
    activityClassificationIds = _.uniq(activityClassificationIds);
    topicCategoryIds = _.uniq(topicCategoryIds);
    sectionIds = _.uniq(sectionIds);

    var availableOptions = {};
    availableOptions['activity_classification'] = _.reject(this.state.allFilterOptions['activity_classification'],
      function(option) {
        return !_.contains(activityClassificationIds, option.id);
    });
    availableOptions['topic_category'] = _.reject(this.state.allFilterOptions['topic_category'],
      function(option) {
        return !_.contains(topicCategoryIds, option.id);
    });
    availableOptions['section'] = _.reject(this.state.allFilterOptions['section'],
      function(option) {
        return !_.contains(sectionIds, option.id);
    });
    return availableOptions;
  },

  // Super bad pluralize function.
  pluralize: function(str) {
    if (str === 'topic_category') {
      return 'topic_categories';
    } else {
      return str + 's';
    }
  },

  determineCurrentPageSearchResults: function () {
    var start, end, currentPageSearchResults;
    start = (this.state.currentPage - 1)*this.state.resultsPerPage;
    end = this.state.currentPage*this.state.resultsPerPage;
    currentPageSearchResults = this.state.activitySearchResults.slice(start, end);
    return currentPageSearchResults;
  },

  updateSearchQuery: function (newQuery) {
    this.setState({searchQuery: newQuery}, this.searchRequest);
  },

  selectFilterOption: function (field, optionId) {
    var filters = _.map(this.state.filters, function (filter) {
      if (filter.field == field) {
        filter.selected = optionId;
      }
      return filter;
    }, this);
    this.setState({filters: filters});
    this.searchRequest();
  },

  updateSort: function (field, asc_or_desc) {
    var sorts = _.map(this.state.sorts, function (sort) {
      if (sort.field == field) {
        sort.selected = true;
        sort.asc_or_desc = asc_or_desc;
      } else {
        sort.selected = false;
        sort.asc_or_desc = 'asc'
      }
      return sort;
    }, this);
    this.setState({sorts: sorts});
    this.searchRequest();
  },

  selectPageNumber: function (number) {
    this.setState({currentPage: number});
  },

  render: function() {
    var currentPageSearchResults = this.determineCurrentPageSearchResults();
    return (
      <section>
        <h3 className="section-header">Select Activities</h3>
        <SearchActivitiesInput updateSearchQuery={this.updateSearchQuery} />
        <ActivitySearchFilters selectFilterOption={this.selectFilterOption} data={this.state.filters} />

        <table className='table activity-table search-and-select'>
          <thead>
            <ActivitySearchSorts updateSort={this.updateSort} sorts={this.state.sorts} />
          </thead>
          <ActivitySearchResults selectedActivities = {this.props.selectedActivities} currentPageSearchResults ={currentPageSearchResults} toggleActivitySelection={this.props.toggleActivitySelection} />
        </table>

        <Pagination maxPageNumber={this.state.maxPageNumber} selectPageNumber={this.selectPageNumber} currentPage={this.state.currentPage} numberOfPages={this.state.numberOfPages}  />

        <SelectedActivities clickContinue={this.props.clickContinue}
                               isEnoughInputProvided={this.props.isEnoughInputProvidedToContinue}
                               errorMessage={this.props.errorMessage}
                               selectedActivities = {this.props.selectedActivities}
                               toggleActivitySelection={this.props.toggleActivitySelection} />
      </section>
    );
  }
});
