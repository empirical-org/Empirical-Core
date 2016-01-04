'use strict';
$(function () {
  var adminDashboard;
  adminDashboard = $('#admin-dashboard')[0];
  if (adminDashboard) {
    var id = $(adminDashboard).data('id')
    var props = {
      analytics: new EC.AnalyticsWrapper(),
      id: id
    };
    React.render(React.createElement(EC.AdminDashboard, props), adminDashboard);
  }
});

EC.AdminDashboard = React.createClass({
  propTypes: {
    analytics: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      model: {
        teachers: []
      },
      newTeacher: {
        first_name: null,
        last_name: null,
        email: null
      }
    }
  },

  componentDidMount: function () {
    $.ajax({
      url: '/admins/' + this.props.id,
      success: this.receiveData
    })
  },

  receiveData: function (data) {
    this.setState({model: data})
  },

  inviteUsersActions: function () {
    return {
      update: this.updateNewTeacher,
      save: this.saveNewTeacher
    }
  },

  saveNewTeacher: function () {
    console.log('saveNewTeacher')
    $.ajax({
      url: '/admins/' + this.props.id + '/teachers',
      data: {teacher: this.state.newTeacher},
      type: 'POST',
      success: this.saveNewTeacherSuccess
    })
  },

  saveNewTeacherSuccess: function (data) {
    console.log('save new teacher success', data)
    var newModel = this.state.model
    var newTeachers = _.chain(newModel.teachers).unshift(data).value();
    newModel.teachers = newTeachers;
    this.setState({model: newModel});
  },

  updateNewTeacher: function (field, value) {
    var newState = this.state
    newState.newTeacher[field] = value
    this.setState(newState)
  },

  inviteUsersData: function () {
    return {
      model: this.state.newTeacher,
      userType: 'Teacher',
      update: this.updateNewTeacher,
      save: this.saveNewTeacher
    }
  },

  render: function () {
    return (
      <div>
        <EC.AdminDashboardTop />
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12'>
              <EC.InviteUsers data={this.inviteUsersData()} actions={this.inviteUsersActions()} />
              <EC.AdminsTeachers data={this.state.model.teachers} />
            </div>
          </div>
        </div>
      </div>
    )
  }
})