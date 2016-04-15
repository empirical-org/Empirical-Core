$(function() {
  var ele = $('#students_classrooms_manager')[0]
  if (ele) {
    React.render(React.createElement(EC.StudentsClassroomsManager), ele)
  }
});


'use strict'
EC.StudentsClassroomsManager = React.createClass({

  getInitialState: function() {
    return {loading: true, classrooms: null};
  },

  componentDidMount: function() {
    this.getClassrooms();
  },

  getClassrooms: function() {
    $.ajax({
      url: "/students_classrooms/classroom_manager_data",
      context: this,
      success: function(data) {
        this.setState({classrooms: data, loading: false});
      }
    });
  },

 classAction: function(status, id) {
   var path = status == 'Archive' ? 'hide':'unhide';
   path = "/students_classrooms/" + id + '/' + path;
   $.ajax({url: path, type: 'POST', context: this, success: this.getClassrooms()});
 },

  mapClassrooms: function(classrooms, status) {
    var that = this;
    var classes = _.map(classrooms, function(cl) {
      return (
        <tr key={cl.id}>
          <td>{cl.teacherName}</td>
          <td>{cl.className}</td>
          <td>{cl.joinDate}</td>
          <td>
            <span onClick={that.classAction.bind(null, status, cl.id)} className={status.toLowerCase() + ' ' + cl.className.replace(/ /g,'')}>{status}</span>
          </td>
        </tr>
      );
    });
    return classes;
  },

  displayClassrooms: function(classrooms, status) {
    return (
      <table>
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Class Name</th>
            <th>Date Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.mapClassrooms(classrooms, status)}
        </tbody>
      </table>
    );
  },

  stateSpecificComponents: function() {
    if (this.state.classrooms !== null) {
      return (
        <div>
          <h1>Active Classes</h1>
          {this.displayClassrooms(this.state.classrooms.active, "Archive")}
          <h1>Archived Classes</h1>
          {this.displayClassrooms(this.state.classrooms.inactive, "Unarchive")}
        </div>
      );
    } else {
      return <h1>loading</h1>;
    }
  },

  render: function() {
    return <div>{this.stateSpecificComponents()}</div>;
  }
});
