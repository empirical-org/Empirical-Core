import React from 'react';
import FilterOption from './filter_option';
import _ from 'underscore';
import $ from 'jquery';
import naturalCmp from 'underscore.string/naturalCmp';
import FilterButton from './filter_button.jsx';
import getParameterByName from '../../../../modules/get_parameter_by_name';

export default React.createClass({

  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeFilterOn) {
      this.setState({ activeFilterId: null, });
    } else if (nextProps.data.field === 'activity_classification' && nextProps.data.options.length > 0) {
      const toolName = getParameterByName('tool');
      if (toolName) {
        const optionId = nextProps.data.options.find(option => option.key === toolName).id;
         // this should only be the case on initial render
        if (this.state.activeFilterId === null && nextProps.data.selected === null) {
          this.handleFilterButtonClick(optionId);
        }
      }
    }
  },

  getInitialState() {
    return { activeFilterId: null, };
  },

  handleFilterButtonClick(optionId) {
    this.selectFilterOption(optionId);
    this.setState({ activeFilterId: optionId, });
  },

  selectFilterOption(optionId) {
    this.props.selectFilterOption(this.props.data.field, optionId);
  },
  clearFilterOptionSelection() {
    this.props.selectFilterOption(this.props.data.field, null);
    this.setState({ activeFilterId: null, });
  },

  getDisplayedFilterOptions() {
    let options,
      isThereASelection,
      clearSelection;
    isThereASelection = !!this.props.data.selected;
    const field = this.props.data.field;

    if (field !== 'activity_classification') {
      // Sort the options alphanumerically.
      this.props.data.options.sort((a, b) =>
        // This is kind of a hack, but all of the filter's options have a 'name' property.
         naturalCmp(a.name, b.name));
    }
    options = this.props.data.options;
    if (options.length) {
      debugger;
    }
    const that = this;
    return _.map(options, (option) => {
      if (field === 'activity_classification') {
        return (<FilterButton key={option.id} handleFilterButtonClick={that.handleFilterButtonClick} data={option} active={that.state.activeFilterId === option.id} />);
      }
      return (
        <FilterOption key={option.id} selectFilterOption={that.selectFilterOption} data={option} />
      );
    }, this);
  },

  getFilterHeader() {
    if (this.props.data.selected) {
      return this.getSelectedOption().name;
    }
    return this.props.data.alias;
  },

  getSelectedOption() {
    return _.find(this.props.data.options, { id: this.props.data.selected, }, this);
  },

  render() {
		// Several cases here:
		// Nothing is selected. 'Filter by X' displays. All other options can be selected.
		// An option is selected. Option name displays. Options now include 'All X'. All options displayed.
    const filterIsButtons = this.props.data.field === 'activity_classification';
    if (filterIsButtons) {
      return (
        <div className="activity-filter button-row">
          {this.getDisplayedFilterOptions()}
          {this.props.children}
        </div>
      );
    }

    return (
      <div className="no-pl">
        <div className="button-select activity-filter-button-wrapper">
          <button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
            {this.getFilterHeader()}
          </button>
          <i className="fa fa-caret-down act-search-filter-fav" />
          <ul className="dropdown-menu" role="menu">
            {this.getDisplayedFilterOptions()}
          </ul>

        </div>
      </div>
    );
  },
});
