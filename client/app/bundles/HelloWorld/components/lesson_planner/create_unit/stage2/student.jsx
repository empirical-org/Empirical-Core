'use strict'

 import React from 'react'
 import $ from 'jquery'

 export default  React.createClass({

  handleStudentSelection: function(e) {
    var checked = $(e.target).is(':checked');
    this.props.toggleStudentSelection(this.props.student, this.props.classroom, checked);
  },

  determineCheckbox: function () {
    if (this.props.student.isSelected == true) {
      return ( <input type="checkbox"
                     checked="checked"
                     className="student_checkbox css-checkbox"
                     id={"student_" + this.props.student.id}
                     onChange={this.handleStudentSelection} />
      );
    } else {
      return (<input type="checkbox"
                     className="student_checkbox css-checkbox"
                     id={"student_" + this.props.student.id}
                     onChange={this.handleStudentSelection} />
      );
    }
  },

  render: function() {
    return (
      <div className="student_column col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
        {this.determineCheckbox()}
        <label htmlFor={"student_" + this.props.student.id} className="css-label">{this.props.student.name}</label>
      </div>
    );
  }
});
