$(function () {
  var studentProfile = $('#student-profile')[0]
  if (studentProfile) {
    React.render(React.createElement(EC.StudentProfile), studentProfile)
  }
});

EC.StudentProfile = React.createClass({
  getInitialState: function () {
    return {

    }
  },

  componentDidMount: function () {
    $.ajax({url: '/profile.json', format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    console.log('data', data)
    this.setState(data)
  },

  render: function () {
    return (
      <div>
        <EC.StudentProfileHeader studentName={"John Johnson"} classroomName={"3rd Grade Englash"} teacherName={"Teacher Lasname"} />
        <EC.NextLesson data={{name: 'A, An, The'}} />
        <EC.StudentProfileUnits />
      </div>
    )
  }
});

