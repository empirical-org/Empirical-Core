import React from 'react'


export default React.createClass({
  propTypes: {
    students: React.PropTypes.array.isRequired
  }

  thead: function() {
    <thead>
      <tr>
        <th>
          First Name
        </th>
        <th>
          Last Name
        </th>
        <th>
          Username
        </th>
      </tr>
    </thead>
  },

  studentsIntoRows: function(){
    this.props.students.forEach(student=>{
      return individualStudentToRow(student)
    })
  },

  individualStudentToRow: function(student){
    return (
      <tr className="user" id={`user_${user_id}`}>
      <td className="first_name">
        {student.first_name}
      </td>
      <td className="last_name">
        {student.last_name}
      </td>
      <td className="user_name">
        {student.user_name}
      </td>
    </tr>)
  },

  render: function() {
    return (
      <table class="table students hidden">
        {this.thead()}
        <tbody>
          {this.studentsIntoRows()}
        </tbody>
      </table>
    )
   }
 });
