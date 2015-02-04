EC.Classroom = React.createClass({

  toggleClassroomCollapse: function(e) {
    $(e.target.parentElement).toggleClass('collapsed'); // .parent here is a hack
    $(this.refs.studentList.getDOMNode()).collapse('toggle');
  },

  render: function() {
    var studentList = this.props.students.map(function(student) {
      return (
        <div className="student_column col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <input type="checkbox" className="student_checkbox css-checkbox" id={"student_" + student.id} />
          <label htmlFor={"student_" + student.id} className="css-label">{student.name}</label>
        </div>
      );
    }, this);

    return (
      <div className='panel-group'>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <h4 className='title'>
              <span>
                Select Entire Class
              </span>
              <a data-toggle="collapse" class="collapsed" onClick={this.toggleClassroomCollapse}>
                <span className="pull-right panel-select-by-student ph-caret-toggle">
                  Select by Student
                </span>
              </a>

              <div>
                <input type="checkbox" className="css-checkbox classroom_checkbox" id={"classroom_checkbox_" + this.props.classroom.id} />
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