//= require ./../general_components/table/sortable_table/table_sorting_mixin.js
import React from 'react';
import TableSortingMixin from '../components/general_components/table/sortable_table/table_sorting_mixin.js';
import _ from 'underscore';
import AdminDashboardTop from '../components/admin_dashboard/admin_dashboard_top.jsx';
import InviteUsers from '../components/invite_users/invite_users.jsx';
import AdminsTeachers from '../components/admin_dashboard/admins_teachers/admins_teachers.jsx';

export default React.createClass({
  mixins: [TableSortingMixin],
  propTypes: {
    id: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      loading: true,
      model: {
        teachers: [],
      },
      newTeacher: {
        first_name: null,
        last_name: null,
        email: null,
      },
    };
  },

  componentDidMount() {
    const sortDefinitions = this.sortDefinitions();
    this.defineSorting(sortDefinitions.config, sortDefinitions.default);
    $.ajax({
      url: `/admins/${this.props.id}`,
      success: this.receiveData,
    });
  },

  // Depending upon whether or not pagination is implemented,
  // sort results client-side or fetch sorted data from server.
  sortHandler() {
    return _.bind(this.sortResults, this, _.noop);
  },

  sortDefinitions() {
    return {
      config: {
        name: 'natural',
        number_of_students: 'numeric',
        number_of_questions_completed: 'numeric',
        time_spent: 'numeric',
      },
      default: {
        field: 'name',
        direction: 'asc',
      },
    };
  },

  teacherColumns() {
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        className: 'teacher-name-column',
      },
      {
        name: 'Students',
        field: 'number_of_students',
        sortByField: 'number_of_students',
        className: 'number-of-students',
      },
      {
        name: 'Questions Completed',
        field: 'number_of_questions_completed',
        sortByField: 'number_of_questions_completed',
        className: 'number-of-questions-completed',
      },
      {
        name: 'Time Spent',
        field: 'time_spent',
        sortByField: 'time_spent',
        className: 'time-spent',
      },
      {
        name: 'View As Teacher',
        field: 'link_components',
        sortByField: 'links',
        className: 'view-as-teacher-link',
      }
    ];
  },

  receiveData(data) {
    this.setState({ model: data, loading: false, });
  },

  inviteUsersActions() {
    return {
      update: this.updateNewTeacher,
      save: this.saveNewTeacher,
    };
  },

  saveNewTeacher() {
    $.ajax({
      url: `/admins/${this.props.id}/teachers`,
      data: { teacher: this.state.newTeacher, authenticity_token: $('meta[name=csrf-token]').attr('content'), },
      type: 'POST',
      success: this.saveNewTeacherSuccess,
    });
  },

  saveNewTeacherSuccess(data) {
    const newModel = this.state.model;
    const newTeachers = _.chain(newModel.teachers).unshift(data).value();
    newModel.teachers = newTeachers;
    this.setState({ model: newModel, });
  },

  updateNewTeacher(field, value) {
    const newState = this.state;
    newState.newTeacher[field] = value;
    this.setState(newState);
  },

  inviteUsersData() {
    return {
      model: this.state.newTeacher,
      userType: 'Teacher',
      update: this.updateNewTeacher,
      save: this.saveNewTeacher,
    };
  },

  render() {
    const teachers = this.applySorting(this.state.model.teachers);
    return (
      <div >
        <div className="sub-container">
          <AdminDashboardTop />
          <div className="flex-row space-between">
            <InviteUsers data={this.inviteUsersData()} actions={this.inviteUsersActions()} />
            <a href="mailto:ryan@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">
              <button className="button-green">Bulk Upload Teachers via CSV</button>
            </a>
          </div>
          <AdminsTeachers
            currentSort={this.state.currentSort}
            loading={this.state.loading}
            sortHandler={this.sortHandler()}
            data={teachers}
            columns={this.teacherColumns()}
          />
        </div>
      </div>
    );
  },
});
