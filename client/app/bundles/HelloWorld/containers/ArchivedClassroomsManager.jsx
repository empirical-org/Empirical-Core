'use strict'
import React from 'react'
import $ from 'jquery'
export default React.createClass({

  propTypes: {
    role: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    var basePath;
    var getClassroomsPath;
    if (this.props.role === 'teacher') {
      basePath = '/teachers/classrooms';
      getClassroomsPath = basePath + '/archived_classroom_manager_data';
    } else if (this.props.role === 'student') {
      basePath = '/students_classrooms';
      getClassroomsPath = basePath + "/classroom_manager_data";
    }
    return {loading: true, classrooms: null, basePath: basePath, getClassroomsPath: getClassroomsPath};
  },

  componentDidMount: function() {
    this.getClassrooms();
  },

  getClassrooms: function() {
    $.ajax({
      url: this.state.getClassroomsPath,
      context: this,
      cache: false,
      success: function(data) {
        this.setState({classrooms: data, loading: false});
      }
    });
  },

 classAction: function(status, id) {
   var that = this;
   var path = status == 'Archive' ? 'hide':'unhide';
   path = this.state.basePath + '/' + id + '/' + path;
   $.post(path)
       .done(
         that.getClassrooms()
       );
 },

 manageClassroom: function(cl){
   return <a className='manage-class' href={this.state.basePath + '/' + cl.id + '/students'}>Manage Class</a>
 },

 tableRows: function(cl){
   var rows;
   if (this.props.role === 'teacher') {
     rows = [<td>{cl.className}</td>,
              <td>{cl.classcode}</td>,
              <td className='student-count'>{cl.studentCount}</td>,
              <td className='created-date'>{cl.createdDate}</td>,
                <td>{this.manageClassroom(cl)}</td>];
   } else if (this.props.role === 'student') {
     rows = [   <td>{cl.teacherName}</td>,
               <td>{cl.className}</td>,
               <td>{cl.joinDate}</td>]

   }
   return rows;
 },

 tableHeaders: function(){
   if (this.props.role === 'teacher') {
     return ([
       <th>Class Name</th>,
       <th>Classcode</th>,
       <th className='student-count'>Student Count</th>,
       <th className='created-date'>Date Created</th>,
       <th>Manage Class</th>,
       <th></th>
     ]);
   } else if (this.props.role === 'student') {
     return ([
       <th>Teacher Name</th>,
       <th>Class Name</th>,
       <th>Date Joined</th>,
       <th></th>
     ]);
   }
   },

  mapClassrooms: function(classrooms, status) {
    var that = this;
    var classes = _.map(classrooms, function(cl) {
      return (
        <tr key={cl.id}>
          {that.tableRows(cl)}
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
      <table className='table'>
        <thead>
          <tr>
            {this.tableHeaders()}
          </tr>
        </thead>
        <tbody>
          {this.mapClassrooms(classrooms, status)}
        </tbody>
      </table>
    );
  },

  joinOrAddClass: function(){
    if (this.props.role === 'teacher') {
      return(<a href='/teachers/classrooms/new' className='btn button-green'>Add a Class</a>)
    } else if (this.props.role === 'students') {
      return(<a href='/students_classrooms/add_classroom' className='btn button-green'>Join a Class</a>)
    }
  },

  activeOrArchived: function(section, action){
    var classes = this.state.classrooms[section];
    var header = <h1>{section.charAt(0).toUpperCase() + section.slice(1) + ' Classes'}</h1>;
    if (classes.length > 0) {
      return(
        [header, this.displayClassrooms(this.state.classrooms[section], action)]
      );
    }
  },

  stateSpecificComponents: function() {
    if (this.state.classrooms !== null) {
      return (
        <div className={this.props.role}>
          {this.activeOrArchived('active', 'Archive')}
          {this.activeOrArchived('inactive', 'Unarchive')}
        </div>
      );
    } else {
      return <h1>loading</h1>;
    }
  },

  render: function() {
    return (
      <div id='archived_classrooms_manager'>
        {this.joinOrAddClass()}
        {this.stateSpecificComponents()}
      </div>
    );
  }
});
