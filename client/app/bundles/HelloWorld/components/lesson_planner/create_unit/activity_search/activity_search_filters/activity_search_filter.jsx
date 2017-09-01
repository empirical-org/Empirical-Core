'use strict'

 import React from 'react'
 import FilterOption from './filter_option'
 import _ from 'underscore'
 import $ from 'jquery'
 import naturalCmp from 'underscore.string/naturalCmp'
 import FilterButton from './filter_button.jsx'
 import getParameterByName from '../../../../modules/get_parameter_by_name'

 export default  React.createClass({

   componentWillReceiveProps: function (nextProps) {
     if (!nextProps.activeFilterOn) {
       this.setState({activeFilterId: null})
     }
     if (nextProps.data.field === 'activity_classification' && nextProps.data.options.length > 0) {
       const toolName = getParameterByName('tool')
       if (toolName) {
         const optionId = nextProps.data.options.find(option => option.key === toolName).id
         if (this.state.activeFilterId !== optionId) {
           this.handleFilterButtonClick(optionId)
         }
       }
     }
   },

   getInitialState: function () {
     return {activeFilterId: null}
   },

  handleFilterButtonClick: function (optionId) {
    this.selectFilterOption(optionId);
    this.setState({activeFilterId: optionId})
  },

	selectFilterOption: function (optionId) {
		this.props.selectFilterOption(this.props.data.field, optionId);
	},
	clearFilterOptionSelection: function () {
		this.props.selectFilterOption(this.props.data.field, null);
    this.setState({activeFilterId: null})
	},


	getDisplayedFilterOptions: function() {
		var options, isThereASelection, clearSelection;
		isThereASelection = !!this.props.data.selected;

		// Sort the options alphanumerically.
		this.props.data.options.sort(function(a, b) {
			// This is kind of a hack, but all of the filter's options have a 'name' property.
			return naturalCmp(a.name, b.name);
		});

		options = this.props.data.options;

    var that = this;
    var field = this.props.data.field;
		return _.map(options, function (option) {
      if (field === 'activity_classification') {
        return (<FilterButton key={option.id} handleFilterButtonClick={that.handleFilterButtonClick} data={option} active={that.state.activeFilterId === option.id}/>);
      }
			return (
          <FilterOption key={option.id} selectFilterOption={that.selectFilterOption} data={option} />
			);
		}, this);
    // let optionsWithSearch = [];
    // let activityClassification = [];
    // options.forEach( option => {
    //   if (field === 'activity_classification') {
    //     activityClassification.push(<FilterButton key={option.name} handleFilterButtonClick={that.handleFilterButtonClick} data={option} active={that.state.activeFilterId === option.id}/>);
    //   } else {
    //     optionsWithSearch.push(this.props.children, <FilterOption key={option.name} selectFilterOption={that.selectFilterOption} data={option} />)
    //   }
    // }, this);
    // return (
    //   [<div key='options-with-search' className='options-with-search'>
    //     {optionsWithSearch}
    //   </div>,
    //   activityClassification]
    // )
	},

	getFilterHeader: function() {
		if (this.props.data.selected) {
			return this.getSelectedOption().name;
		} else {
			return this.props.data.alias;
		}
	},

	getSelectedOption: function() {
		return _.find(this.props.data.options, {id: this.props.data.selected}, this);
	},

	render: function () {
		// Several cases here:
		// Nothing is selected. 'Filter by X' displays. All other options can be selected.
		// An option is selected. Option name displays. Options now include 'All X'. All options displayed.
    let filterIsButtons = this.props.data.field === 'activity_classification'
    if (filterIsButtons) {
      return (
        <div className='activity-filter button-row'>
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
          <i className="fa fa-caret-down act-search-filter-fav"></i>
					<ul className="dropdown-menu" role="menu">
						{this.getDisplayedFilterOptions()}
					</ul>

				</div>
			</div>
		);
	}
});
