EC.MyResources = React.createClass({

  createMinis: function() {
    return(
      <div>
        <EC.VideoMini videoCode='https://www.youtube.com/embed/i-clKDhqrqQ'/>
        <EC.TeacherResourcesMini/>
        <EC.GoogleClassroomMini/>
      </div>);
  },

  render: function() {
    return (
      <div className='dashboard-section-container'>
        <h3 className='dashboard-header'>My Resources</h3>
        <div className='row'>
          {this.createMinis()}
        </div>
      </div>
    );
  }

});
