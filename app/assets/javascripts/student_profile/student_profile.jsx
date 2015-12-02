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
      grouped_scores: {},
      ajaxReturned: false
    }
  },

  componentDidMount: function () {
    $.ajax({url: '/profile.json', format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    this.setState(_.extend(data, {ajaxReturned: true}))
  },

  render: function () {
    if (this.state.ajaxReturned) {
      return (
        <div>
          <EC.StudentProfileHeader data={this.state.student} />
          <EC.NextActivity data={this.state.next_activity_session} />
          <EC.StudentProfileUnits data={this.state.grouped_scores} />
        </div>
      )
    } else return <span></span>
  }
});

