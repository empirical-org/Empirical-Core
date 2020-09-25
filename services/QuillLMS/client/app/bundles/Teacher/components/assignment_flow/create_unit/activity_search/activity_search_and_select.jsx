import React from 'react';
import _ from 'underscore';
import _l from 'lodash';
import request from 'request';

import ActivitySearchAndFilters from './activity_search_filters/activity_search_filters';
import ActivitySearchFilterConfig from './activity_search_filters/activity_search_filter_config';
import ActivitySearchSortConfig from './activity_search_sort/activity_search_sort_config';
import ActivitySearchSorts from './activity_search_sort/activity_search_sorts';
import ActivitySearchResults from './activity_search_results/activity_search_results';
import Pagination from './pagination/pagination';
import SelectedActivities from './selected_activities/selected_activities';

import LoadingIndicator from '../../../shared/loading_indicator.jsx';
import getParameterByName from '../../../modules/get_parameter_by_name';

const resultsPerPage = 25;
const showAllId = 'showAllId';

export default class ActivitySearchAndSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      filters: ActivitySearchFilterConfig(),
      sorts: ActivitySearchSortConfig,
      maxPageNumber: 1,
      activeFilterOn: !!getParameterByName('tool'),
      error: null,
    }
  }

  componentDidMount() {
    if (this.props.activities) {
      this.searchRequestSuccess({ data: this.props.activities })
    } else {
      this.searchRequest();
    }
  }

  activityContainsSearchTerm(activity) {
    const stringActivity = Object.values(activity).join(' ').toLowerCase();
    return stringActivity.includes(this.state.searchQuery.toLowerCase());
  }

  changeViewableActivities() {
    const selectedFiltersAndFields = this.selectedFiltersAndFields();
    const sFFLength = selectedFiltersAndFields.length;
    const viewableActivities = this.state.activitySearchResults.filter((activity) => {
      let matchingFieldCount = 0;
      selectedFiltersAndFields.forEach((filter) => {
        if ((activity[filter.field].id || activity[filter.field]) === filter.selected) {
          matchingFieldCount += 1;
        }
      });
      let matchesSearchQuery = true;
      if (this.state.searchQuery) {
        matchesSearchQuery = this.activityContainsSearchTerm(activity);
      }
      return (matchingFieldCount === sFFLength) && matchesSearchQuery;
    });
    this.setState({ viewableActivities,
      currentPage: 1,
      maxPageNumber: Math.ceil(viewableActivities.length / resultsPerPage),
      numberOfPages: Math.ceil(viewableActivities.length / resultsPerPage),
    }, this.updateFilterOptionsAfterChange);
  }

  clearFilters = () => {
    this.setState({
      filters: ActivitySearchFilterConfig(),
      activeFilterOn: false,
      searchQuery: '',
    }, this.changeViewableActivities);
  };

  currentPageResults() {
    const lowerBound = (this.state.currentPage - 1) * resultsPerPage;
    const upperBound = (this.state.currentPage) * resultsPerPage;
    return this.state.viewableActivities.slice(lowerBound, upperBound);
  }

  errorState(error) {
    this.setState({ error, });
  }

  findFilterOptionsBasedOnActivities(activities = null) {
    const viewableActivities = activities ? activities : this.state.viewableActivities
    const filterFields = this.state.filters.map(filter => filter.field);
    const availableOptions = {};
    // get all filter keys and then map them onto availableOptions as empty arrs
    filterFields.forEach((field) => {
      availableOptions[field] = [];
    });
    viewableActivities.forEach((activity) => {
      filterFields.forEach((field) => {
        if (activity[field].name || activity[field].alias) {
          availableOptions[field].push(activity[field]);
        }
      });
    });
    filterFields.forEach((field) => {
      if (field === 'activity_category') {
        availableOptions[field].unshift({ name: 'All concepts', id: showAllId, });
      } else if (field === 'section') {
        availableOptions[field].unshift({ name: 'All levels', id: showAllId, });
      }
    });
    return availableOptions;
  }

  searchRequest() {
    this.setState({ loading: true, });
    request.get({
      url: `${process.env.DEFAULT_URL}/activities/search`
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      if (r.statusCode === 200) {
        this.searchRequestSuccess(parsedBody)
      } else {
        this.errorState('This search could not be completed')
      }
    });
  }

  searchRequestSuccess(data) {
    const hash = {
      activitySearchResults: data.activities,
      viewableActivities: data.activities,
      numberOfPages: Math.ceil(data.activities.length / resultsPerPage),
      maxPageNumber: Math.ceil(data.activities.length / resultsPerPage),
      currentPage: 1,
      loading: false,
    };
    this.setState(hash, this.updateFilterOptionsAfterChange);
  }

  selectFilterOption = (field, optionId) => {
    let activeFilterOn = true;
    const filters = _.map(this.state.filters, (filter) => {
      if (filter.field == field) {
        // Is this an already selected activity_classification field? Deselect it!
        if (field === 'activity_classification' && filter.selected == optionId) {
          filter.selected = null;
          activeFilterOn = false;
        } else {
          filter.selected = optionId;
        }
      }
      return filter;
    }, this);
    this.setState({ filters, activeFilterOn, }, this.changeViewableActivities);
  };

  selectPageNumber = number => {
    this.setState({ currentPage: number, });
  };

  selectedFiltersAndFields() {
    return this.state.filters.reduce((selected, filter) => {
      if (filter.selected && filter.selected !== showAllId) {
        selected.push({ field: filter.field, selected: filter.selected, });
      }
      return selected;
    }, []);
  }

  sort() {
    let visActs = [...this.state.viewableActivities];
    this.state.sorts.forEach((sortObj) => {
      // iterate through each sorter, and activate it;
      if (sortObj.selected) {
        visActs = _.sortBy(visActs, obj => _l.get(obj, sortObj.sortPath));
        if (sortObj.asc_or_desc === 'desc') {
          // reverse sorter if necessary
          visActs = visActs.reverse();
        }
      }
    });
    this.setState({ viewableActivities: visActs, });
  }

  updateFilterOptionsAfterChange() {
    // Go through all the filters, and only display the options that are available based on the viewableActivity array
    const availableOptions = this.findFilterOptionsBasedOnActivities();
    const activityClassificationOptions = this.findFilterOptionsBasedOnActivities(this.state.activitySearchResults)
    const newFilters = [...this.state.filters];
    newFilters.forEach((filter) => {
      if (filter.field === 'activity_classification') {
        filter.options = activityClassificationOptions[filter.field]
      } else {
        filter.options = availableOptions[filter.field];
      }
    });
    this.setState({ filters: newFilters, });
  }

  updateSearchQuery = e => {
    this.setState({ searchQuery: e.target.value, }, this.changeViewableActivities);
  };

  updateSort = (field, asc_or_desc) => {
    const sorts = _.map(this.state.sorts, (sort) => {
      if (sort.field == field) {
        sort.selected = true;
        sort.asc_or_desc = asc_or_desc;
      } else {
        sort.selected = false;
        sort.asc_or_desc = 'asc';
      }
      return sort;
    }, this);
    this.setState({ sorts, }, this.sort);
  }

  render() {
    let table,
      loading,
      pagination;
    if (this.state.loading) {
      loading = <LoadingIndicator />;
    } else if (this.state.error) {
      table = <span>We're experiencing the following error: {this.state.error}</span>;
    } else {
      pagination = <Pagination currentPage={this.state.currentPage} maxPageNumber={this.state.maxPageNumber} numberOfPages={this.state.numberOfPages} selectPageNumber={this.selectPageNumber} />;
      table = <ActivitySearchResults currentPageSearchResults={this.currentPageResults()} selectedActivities={this.props.selectedActivities} toggleActivitySelection={this.props.toggleActivitySelection} />;
    }
    return (
      <section>
        <h1 className="create-your-own-activity-pack-header">Create your own activity pack.</h1>
        <ActivitySearchAndFilters
          activeFilterOn={this.state.activeFilterOn}
          clearFilters={this.clearFilters}
          data={this.state.filters}
          searchQuery={this.state.searchQuery}
          selectFilterOption={this.selectFilterOption}
          showAllId={showAllId}
          updateSearchQuery={this.updateSearchQuery}
        />
        <table className="table activity-table search-and-select green-rows-on-hover">
          <thead>
            <ActivitySearchSorts
              sorts={this.state.sorts}
              updateSort={this.updateSort}
            />
          </thead>
          {table}
        </table>
        {loading}
        {pagination}
        <SelectedActivities
          clickContinue={this.props.clickContinue}
          errorMessage={this.props.errorMessage || ''}
          selectedActivities={this.props.selectedActivities}
          sortable={this.props.sortable}
          sortCallback={this.props.sortCallback}
          toggleActivitySelection={this.props.toggleActivitySelection}
          unitName={this.props.unitName}
        />
      </section>
    );
  }
}
