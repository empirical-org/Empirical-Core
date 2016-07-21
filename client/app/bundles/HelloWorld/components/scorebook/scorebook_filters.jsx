"use strict";

import React from 'react'
import DropdownFilter from '../progress_reports/dropdown_filter.jsx'
import DateRangeFilter from '../general_components/date_range_filter.jsx'

export default React.createClass({
  render: function () {
		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
					<DropdownFilter
						options={this.props.classroomFilters}
						selectOption={this.props.selectClassroom}
						selectedOption={this.props.selectedClassroom} />
				</div>
				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
					<DropdownFilter
						options={this.props.unitFilters}
						selectOption={this.props.selectUnit}
						selectedOption={this.props.selectedUnit}/>
				</div>
				<div className="col-xs-12 col-sm-6">
					<DateRangeFilter selectDates={this.props.selectDates}/>
				</div>
			</div>
		);
	}
});
