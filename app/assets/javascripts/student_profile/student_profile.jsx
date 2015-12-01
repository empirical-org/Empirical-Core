$(function () {
  var studentProfile = $('#student-profile')[0]
  if (studentProfile) {
    React.render(React.createElement(EC.StudentProfile), studentProfile)
  }
});

EC.StudentProfile = React.createClass({
  getInitialState: function () {
    return {
      next_activity_session: {activity: {}},
      student: {classroom: {teacher: {}}},
      grouped_scores: {}
    }
  },

  componentDidMount: function () {
    $.ajax({url: '/profile.json', format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    this.setState(data)
  },

  render: function () {
    return (
      <div>
        <EC.StudentProfileHeader data={this.state.student} />
        <EC.NextLesson data={this.state.next_activity_session} />
        <EC.StudentProfileUnits data={this.state.grouped_scores} />
      </div>
    )
  }
});

