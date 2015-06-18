"use strict";
EC.ScorebookFilters = React.createClass({
  render: function () {
		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
					<EC.DropdownFilter
						options={this.props.classroomFilters}
						selectOption={this.props.selectClassroom}
						selectedOption={this.props.selectedClassroom} />
				</div>
				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
					<EC.DropdownFilter
						options={this.props.unitFilters}
						selectOption={this.props.selectUnit}
						selectedOption={this.props.selectedUnit}/>
				</div>
				<div className="col-xs-12 col-sm-6">
					<EC.DateRangeFilter selectDates={this.props.selectDates}/>
				</div>
			</div>
		);
	}
});


