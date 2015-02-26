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
        <EC.DropdownFilter defaultOption={'All Classrooms'} options={this.props.classroomFilters} selectOption={this.props.selectClassroom} />
        <EC.DropdownFilter defaultOption={'All Units'} options={this.props.unitFilters} selectOption={this.props.selectUnit} />
        <EC.DropdownFilter defaultOption={'All Students'} options={this.props.studentFilters} selectOption={this.props.selectStudent} />
      </div>
    );
  }
});