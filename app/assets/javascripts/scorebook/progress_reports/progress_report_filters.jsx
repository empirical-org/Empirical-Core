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
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
          <EC.DropdownFilter defaultOption={ {name: 'All Classrooms', value: ''} } options={this.props.classroomFilters} selectOption={this.props.selectClassroom} />
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
          <EC.DropdownFilter defaultOption={ {name: 'All Units', value: ''} } options={this.props.unitFilters} selectOption={this.props.selectUnit} />
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
          <EC.DropdownFilter defaultOption={ {name: 'All Students', value: ''} } options={this.props.studentFilters} selectOption={this.props.selectStudent} />
        </div>
      </div>
    );
  }
});