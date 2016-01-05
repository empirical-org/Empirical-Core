//= require ./../general_components/table/sortable_table/table_sorting_mixin.js
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
  mixins: [EC.TableSortingMixin],
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

  // Depending upon whether or not pagination is implemented,
  // sort results client-side or fetch sorted data from server.
  sortHandler: function() {
    return _.bind(this.sortResults, this, _.noop);
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural',
        number_of_students: 'numeric',
        number_of_questions_completed: 'numeric',
        time_spent: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  teacherColumns: function () {
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        className: 'teacher-name-column'
      },
      {
        name: 'Students',
        field: 'number_of_students',
        sortByField: 'number_of_students',
        className: 'number-of-students'
      },
      {
        name: 'Questions Completed',
        field: 'number_of_questions_completed',
        sortByField: 'number_of_questions_completed',
        className: 'number-of-questions-completed'
      },
      {
        name: 'Time Spent',
        field: 'time_spent',
        sortByField: 'time_spent',
        className: 'time-spent'
      },
      {
        name: 'View As Teacher',
        field: 'link_components',
        sortByField: 'links',
        className: 'view-as-teacher-link'
      }
    ]
  },

  componentDidMount: function () {
    var sortDefinitions = this.sortDefinitions();
    this.defineSorting(sortDefinitions.config, sortDefinitions.default);
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
    var teachers = this.applySorting(this.state.model.teachers);
    console.log('teachers', teachers)
    return (
      <div className='container'>
        <div className='sub-container'>
          <EC.AdminDashboardTop />
          <div className='row'>
            <div className='col-xs-12'>
              <EC.InviteUsers data={this.inviteUsersData()} actions={this.inviteUsersActions()} />
              <EC.AdminsTeachers currentSort={this.state.currentSort}
                                 sortHandler={this.sortHandler()}
                                 data={teachers}
                                 columns={this.teacherColumns()} />
            </div>
          </div>
        </div>
      </div>
    )
  }
})