"use strict";
EC.Classroom = React.createClass({

  handleClassroomSelection: function(e) {
    var checked = $(e.target).is(':checked');
    this.props.toggleClassroomSelection(this.props.classroom, checked);
  },

  toggleClassroomCollapse: function(e) {
    $(e.target.parentElement).toggleClass('collapsed'); // .parent here is a hack
    $(this.refs.studentList.getDOMNode()).collapse('toggle');
  },

  determineCheckbox: function () {
    var allSelected;
    if (this.props.students) {
      var selected = _.where(this.props.students, {isSelected: true});
      allSelected = (selected.length == this.props.students.length);
    } else {
      allSelected = false;
    }

    if (allSelected) {
      return (
        <input type="checkbox"
               checked="checked"
               className="css-checkbox classroom_checkbox"
               id={"classroom_checkbox_" + this.props.classroom.id}
               onChange={this.handleClassroomSelection} />
      );
    } else {
      return (
        <input type="checkbox"
               className="css-checkbox classroom_checkbox"
               id={"classroom_checkbox_" + this.props.classroom.id}
               onChange={this.handleClassroomSelection} />
      );
    }
  },

  render: function() {
    var studentList = this.props.students.map(function(student) {
      return <EC.Student student={student} classroom={this.props.classroom} toggleStudentSelection={this.props.toggleStudentSelection} />;
    }, this);

    return (
      <div className='panel-group'>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <h4 className='title'>
              <span>
                Select Entire Class
              </span>
              <a data-toggle="collapse" className="collapsed" onClick={this.toggleClassroomCollapse}>
                <span className="pull-right panel-select-by-student ph-caret-toggle">
                  Select by Student
                </span>
              </a>
              <div>
                {this.determineCheckbox()}
                <label className="css-label" htmlFor={"classroom_checkbox_" + this.props.classroom.id}>
                  {this.props.classroom.name}
                </label>
              </div>
            </h4>
          </div>
          <div className="panel-collapse collapse" ref="studentList">
            <div className="panel-body">
              {studentList}
            </div>
          </div>
        </div>
      </div>
    )
  }
});