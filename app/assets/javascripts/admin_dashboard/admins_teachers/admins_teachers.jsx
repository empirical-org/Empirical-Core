EC.AdminsTeachers = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    var teachers = _.map(this.props.data, function (teacher) {
      return <EC.AdminsTeacher key={teacher.id} data={teacher} />
    }, this)
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <EC.ReactCSSTransitionGroup Rct transitionName='adminTeacher'
               transitionEnterTimeout={3000}
               transitionEnterLeaveTimeout={300}>
            {teachers}
          </EC.ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
});