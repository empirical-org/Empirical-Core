'use strict'

 import React from 'react'
 import ActivitySearchFilter from './activity_search_filter'
 import _ from 'underscore'

 export default  React.createClass({



	render: function () {

    let clearButton;
    if (_.any(this.props.data, (el)=>el.selected !== null)) {
        clearButton = <div className='clear-filters' onClick={this.props.clearFilters}><span><img src="/images/x.svg"/>Clear All Filters</span></div>;
    };


    var filters = this.props.data.map((filter, index)=> {
      if (index === 0) {
      	return (<ActivitySearchFilter key={filter.alias} selectFilterOption = {this.props.selectFilterOption} data={filter}>
          {clearButton}
        </ActivitySearchFilter>);
      } else {
        return <ActivitySearchFilter key={filter.alias} selectFilterOption = {this.props.selectFilterOption} data={filter}/>;
      }
    });

    filters.reverse();



		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
					{filters}
          {/*{clearButton}*/}
				</div>
			</div>
		);
	}
});
