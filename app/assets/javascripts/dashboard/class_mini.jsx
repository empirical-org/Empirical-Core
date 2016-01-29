EC.ClassMini = React.createClass({


  manageClassGear: function(){
    return(<a className='pull-right class-gear' href={this.manageClassLink()}><img src='/manage_class_icon.png'></img></a>);
  },

  manageClassLink: function() {
    classId = this.props.classObj.classroom.id.toString();
    return ('/teachers/classrooms/'+ classId + '/students');
  },


  studentCount: function(){
    if (this.props.classObj.students !== 0) {
      return (this.props.classObj.students + ' Students');
    }
  },

  activityCount: function(){
    if (this.props.classObj.activities_completed !== 0) {
      return (this.props.classObj.activities_completed + ' Activities Completed');
    }
  },

  classroomSpecificButton: function() {
    if (!this.studentCount()) {
      return (<button className='button-green'>Invite Students</button>);
    }
    else if (!this.activityCount()) {
      return (<a href="/teachers/classrooms/lesson_planner?tab=exploreActivityPacks"><button className='button-green'>Assign Activities</button></a>);
    }
    else {
      return (<a href=""><button className='button-green'>View Results</button></a>);
    }
  },

  render: function() {
    return (
      <div className={"classroom_mini_container col-md-4 row_num_" + this.props.rowNum}>
        <div className ={"classroom_mini_content text-center"}>
          {this.manageClassGear()}
          <img className='class_icon' src='/class_icon.png'></img>
          <h3 className='classroom_name'> {this.props.classObj.classroom.name}</h3>
          <div className='classMetaData text-center'>
            <p> Classcode: {this.props.classObj.classroom.code}</p>
            <p> {this.studentCount()} </p>
            <p><b>{this.activityCount()}</b></p>
          </div>
          {this.classroomSpecificButton()}
        </div>
      </div>
    );
  }
});
