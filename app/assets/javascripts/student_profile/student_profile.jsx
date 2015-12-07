$(function () {
  var studentProfile = $('#student-profile')[0]
  if (studentProfile) {
    React.render(React.createElement(EC.StudentProfile), studentProfile)
  }
});

EC.StudentProfile = React.createClass({
  getInitialState: function () {
    this.modules = {
      setter: new EC.modules.setter(),
      scrollify: new EC.modules.scrollify()
    };
    return {
      next_activity_session: {activity: {}},
      student: {classroom: {teacher: {}}},
      grouped_scores: {},
      is_last_page: false,
      currentPage: 0,
      loading: false
    };
  },

  componentDidMount: function () {
    this.modules.scrollify.scrollify('#page-content-wrapper', this)
    this.setState({loading: true})
    this.fetchData();
  },

  fetchData: function () {
    this.setState({loading: true})
    $.ajax({url: '/profile.json', data: {current_page: this.state.currentPage}, format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    // need to deep merge the grouped_scores
    var mergeArrays, merged;
    mergeArrays = true;
    merged = this.modules.setter.setOrExtend(this.state, null, data, mergeArrays)
    console.log('data', data)
    console.log('merged', merged)
    this.setState(_.extend(merged, {ajaxReturned: true, loading: false, currentPage: this.state.currentPage + 1}))
  },

  render: function () {
    if (this.state.currentPage > 0) {
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

