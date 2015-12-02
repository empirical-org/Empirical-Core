$(function () {
  var studentProfile = $('#student-profile')[0]
  if (studentProfile) {
    React.render(React.createElement(EC.StudentProfile), studentProfile)
  }
});

EC.StudentProfile = React.createClass({
  getInitialState: function () {
    this.modules = {
      scrollify: new EC.modules.scrollify()
    }
    return {
      next_activity_session: {activity: {}},
      student: {classroom: {teacher: {}}},
      grouped_scores: {},
      isLastPage: false,
      currentPage: null,
      loading: false
    }
  },

  componentDidMount: function () {
    this.modules.scrollify.scrollify('#page-content-wrapper', this)
    this.setState({loading: true})
    this.fetchData();
  },

  fetchData: function () {
    $.ajax({url: '/profile.json', data: {current_page: this.state.currentPage}, format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    this.setState(_.extend(data, {ajaxReturned: true, loading: false}))
  },

  render: function () {
    if (this.state.currentPage) {
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

