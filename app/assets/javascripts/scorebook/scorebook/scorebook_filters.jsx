"use strict;"
EC.ScorebookFilters = React.createClass({
  render: function () {
		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
					<EC.DropdownFilter
						options={this.props.classroomFilters}
						selectOption={this.props.selectClassroom}
						selectedOption={this.props.selectedClassroom} />
				</div>
				<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
					<EC.DropdownFilter
						options={this.props.unitFilters}
						selectOption={this.props.selectUnit}
						selectedOption={this.props.selectedUnit}/>
				</div>
			</div>
		);
	}
});


