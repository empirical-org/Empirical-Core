EC.GoogleClassroomMini = React.createClass({

  miniBuilder: function() {
    return (
      <div className='resources-container google-classroom-announcement'>
        <h4>Google Classroom Announcement</h4>
          <img src='/images/google_classroom_icon.png'></img>
          <p>Your students can now use Clever or Google Classroom to automatically join your classroom.</p>
      </div>
    );
    // <span><a href='placeholder'>Read the Announcement ></a></span> #### FOR WHEN THE ANNOUNCMENT IS UP
  },

  render: function() {
    return (<span/>)
    // return (
    //   // <div className={"mini_container col-md-4 col-sm-5 text-center"}>
    //   //   <div className="mini_content">
    //   //     {this.miniBuilder()}
    //   //   </div>
    //   // </div>
    // );
  }
});
