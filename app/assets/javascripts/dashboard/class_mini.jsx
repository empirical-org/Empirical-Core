EC.ClassMini = React.createClass({

  studentCount: function(){
    if (this.props.classObj.students !== 0) {
      return (this.props.classObj.students + ' Students');
    }
    else {
      return (<button type='button' className='btn btn-primary'></button>)
    }
  },

  activityCount: function(){
    // if (this.props.classObj.activities_completed !== 0) {
      return (this.props.classObj.activities_completed + ' Activities Completed');
    // }
    // else {
    //   return (<button type='button' className='btn btn-primary'></button>)
    // }
  },

  render: function() {
    return (
      <div className={"classroom_mini_container col-md-4 row_num_" + this.props.rowNum}>
        <div className ={"classroom_mini_content text-center"}>
          <img src='/class_icon.png'></img>
          <h3 className='classroom_name'> {this.props.classObj.classroom.name}</h3>
          <div className='classMetaData'>
            <p> Classcode: {this.props.classObj.classroom.code}</p>
            <p> {this.studentCount()} </p>
            <p><b>{this.activityCount()}</b></p>
          </div>
        </div>
      </div>
    );
  }
});
