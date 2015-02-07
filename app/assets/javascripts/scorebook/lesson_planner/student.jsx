EC.Student = React.createClass({
  handleStudentSelection: function(e) {
    var checked = $(e.target).is(':checked');
    this.props.toggleStudentSelection(this.props.student, this.props.classroom, checked);
  },

  render: function() {
    return (
      <div className="student_column col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
        <input type="checkbox" 
               className="student_checkbox css-checkbox"
               id={"student_" + this.props.student.id} 
               onChange={this.handleStudentSelection} />
        <label htmlFor={"student_" + this.props.student.id} className="css-label">{this.props.student.name}</label>
      </div>
    );
  }
});