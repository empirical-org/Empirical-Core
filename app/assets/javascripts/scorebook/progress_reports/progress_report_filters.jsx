EC.ProgressReportFilters = React.createClass({

  propTypes: {
    classroomFilters: React.PropTypes.array.isRequired,
    studentFilters: React.PropTypes.array.isRequired,
    unitFilters: React.PropTypes.array.isRequired,
    selectUnit: React.PropTypes.func.isRequired,
    selectClassroom: React.PropTypes.func.isRequired,
    selectStudent: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="row activity-page-dropdown-wrapper">
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 classroom-filter">
          <EC.DropdownFilter defaultOption={'All Classrooms'} options={this.props.classroomFilters} selectOption={this.props.selectClassroom} />
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 unit-filter">
          <EC.DropdownFilter defaultOption={'All Units'} options={this.props.unitFilters} selectOption={this.props.selectUnit} />
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 student-filter">
          <EC.DropdownFilter defaultOption={'All Students'} options={this.props.studentFilters} selectOption={this.props.selectStudent} />
        </div>
      </div>
    );
  }
});