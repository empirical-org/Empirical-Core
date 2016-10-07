'use strict'
import React from 'react'
import $ from 'jquery'
import _ from 'underscore'

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

 manageClassroom: function(classroomId){
   return <a className='manage-class' href={this.state.basePath + '/' + classroomId + '/students'}>Manage Class</a>;
 },

 tableRows: function(cl, action){
   let manageClass = action === 'Archive' ? this.manageClassroom(cl.id) : '';
   let final = <span onClick={this.classAction.bind(null, action, cl.id)} className={action.toLowerCase() + ' ' + cl.className.replace(/ /g,'')}>{action}</span>;
   if (this.props.role === 'teacher') {
     return (
       <tr key={cl.id}>
          <td>{cl.className}</td>
          <td>{cl.classcode}</td>
          <td className='student-count'>{cl.studentCount}</td>
          <td className='created-date'>{cl.createdDate}</td>
          <td>{manageClass}</td>
          <td>{final}</td>
        </tr>);
   } else if (this.props.role === 'student') {
     return (
       <tr key={cl.id}>
          <td>{cl.teacherName}</td>
          <td>{cl.className}</td>
          <td>{cl.joinDate}</td>
          <td>{final}</td>
        </tr>
      );
   }
 },

 tableHeaders: function(action){
   let content;
   if (this.props.role === 'teacher') {
     let manageClass = action === 'Archive' ? 'Manage Class' : '';
     content =
       <tr>
         <th>Class Name</th>
         <th>Classcode</th>
         <th className='student-count'>Student Count</th>
         <th className='created-date'>Date Created</th>
         <th>{manageClass}</th>
         <th></th>
       </tr>
     ;
   } else if (this.props.role === 'student') {
     content =
       <tr>
         <th>Teacher Name</th>
         <th>Class Name</th>
         <th>Date Joined</th>
         <th></th>
       </tr>
     ;
   }
   return (<thead>
              {content}
           </thead>);
   },

  mapClassrooms: function(classrooms, status) {
    var that = this;
    var classes = _.map(classrooms, function(cl) {
      return (
        that.tableRows(cl, status)
      );
    });
    return classes;
  },

  displayClassrooms: function(classrooms, status) {
    return (
      <table className='table'>
        {this.tableHeaders(status)}
        <tbody>
          {this.mapClassrooms(classrooms, status)}
        </tbody>
      </table>
    );
  },

  joinOrAddClass: function(){
    if (this.props.role === 'teacher') {
      return(<a href='/teachers/classrooms/new' className='btn button-green'>Add a Class</a>);
    } else if (this.props.role === 'students') {
      return(<a href='/students_classrooms/add_classroom' className='btn button-green'>Join a Class</a>);
    }
  },

  activeOrArchived: function(section, action){
    var classes = this.state.classrooms[section];
    var header = <h1>{section.charAt(0).toUpperCase() + section.slice(1) + ' Classes'}</h1>;
    if (classes.length > 0) {
      return(
        // [header, this.displayClassrooms(this.state.classrooms[section], action)]
        <div>
          {header}
          {this.displayClassrooms(this.state.classrooms[section], action)}
        </div>
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
