import React from 'react';
import FilterOption from './filter_option';
import _ from 'lodash';
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
    const field = this.props.data.field;
    // unique options
    const options = _.uniqWith(this.props.data.options, _.isEqual);
    if (field !== 'activity_classification') {
      options.sort(function(a, b) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    }
    // ensure that the show all option is always on the top
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.id === this.props.showAllId) {
        options.splice(i, 1);
        options.unshift(option);
      }
    }
    return options.map((option) => {
      if (field === 'activity_classification') {
        return (<FilterButton className='hey' key={`${option.id}-activity`} handleFilterButtonClick={this.handleFilterButtonClick} data={option} active={this.state.activeFilterId === option.id} />);
      }
      return (
        <FilterOption key={`${option.id}-${option.name}`} selectFilterOption={this.selectFilterOption} data={option} />
      );
    });
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
		// Nothing is selected. 'Filter by X' displays. All other options can be selected.
		// An option is selected. Option name displays. Options now include 'All X'.
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
            <i className="fa fa-caret-down act-search-filter-fav" />
          </button>
          <ul className="dropdown-menu" role="menu">
            {this.getDisplayedFilterOptions()}
          </ul>

        </div>
      </div>
    );
  },
});
