EC.AdminsTeachers = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    var teachers = _.map(this.props.data, function (teacher) {
      return <EC.AdminsTeacher data={teacher} />
    }, this)
    return (
      <span>{teachers}</span>
    );
  }
});