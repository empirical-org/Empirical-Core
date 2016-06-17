'use strict'
EC.ArchivedClassroomsManager = React.createClass({

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
    return {loading: true, classrooms: null, getClassroomsPath: getClassroomsPath};
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
   path = "/students_classrooms/" + id + '/' + path;
   $.post(path)
       .done(
         that.getClassrooms()
       );
 },

 tableRows: function(cl){
   var rows;
   if (this.props.role === 'teacher') {
     rows = [<td>{cl.className}</td>,
     <td>{cl.createdDate}</td>];
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
       <th>Date Created</th>,
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
    return (
      <div id='archived_classrooms_manager'>
        <a href='/students_classrooms/add_classroom' className='btn button-green'>
          Join a Class
        </a>
        {this.stateSpecificComponents()}
      </div>
    );
  }
});
