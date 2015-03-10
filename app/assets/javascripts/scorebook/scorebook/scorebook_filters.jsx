EC.ScorebookFilters = React.createClass({
	selectOption: function () {
		console.log('select option')
	},

	render: function () {
		return (
			<div className="row activity-page-dropdown-wrapper">
				<EC.DropdownFilter 
					options={this.props.classroomFilters}
					selectOption={this.props.selectClassroom}
					defaultOption={this.props.defaultClassroom} />
				<EC.DropdownFilter
					options={this.props.unitFilters}
					selectOption={this.props.defaultUnit}
					defaultOption="Unit 1" />

			</div>
		);
	}


});


