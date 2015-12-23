EC.AdminsTeacher = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <span>
        <span>{this.props.data.name}</span>
        <a href={this.props.data.classroom_manager_path}>Class Manager</a>
        <a href={this.props.data.progress_reports_path}>Progress Reports</a>
      </span>
    )
  }
});