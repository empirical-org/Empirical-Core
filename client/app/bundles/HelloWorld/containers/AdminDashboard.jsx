//= require ./../general_components/table/sortable_table/table_sorting_mixin.js
import React from 'react';
import TableSortingMixin from '../components/general_components/table/sortable_table/table_sorting_mixin.js';
import _ from 'underscore';
import AdminDashboardTop from '../components/admin_dashboard/admin_dashboard_top.jsx';
import AdminsTeachers from '../components/admin_dashboard/admins_teachers/admins_teachers.jsx';
import pluralize from 'pluralize';

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

  displaySchools() {
    if (this.state.model && this.state.model.schools) {
      return (<p style={{ paddingTop: '1em', paddingBottom: '1em', }}><strong>You are an admin of the following {this.schoolConjugation()}: </strong><br />
        {this.state.model.schools.join(', ')}</p>);
    }
    return '';
  },

  schoolConjugation() {
    const schoolCount = this.state.model.schools.length;
    return pluralize('school', schoolCount);
  },

  render() {
    const teachers = this.applySorting(this.state.model.teachers);
    if (!this.state.loading) {
      return (
        <div >
          <div className="sub-container">
            <AdminDashboardTop />
            <div className="flex-row space-between">
              <div>
                <h3>Connecting With Your Teachers</h3>
                When a teacher joins a school you are an admin of, you will automatically see them added below. Teachers can add schools by following <a className="green-link" href="https://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-add-my-school">these instructions.</a>
                {this.displaySchools()}
              </div>
              <a className="green-link" href="mailto:ryan@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">
                <button className="button-green">Bulk Upload Teachers via CSV</button>
              </a>
            </div>
            <AdminsTeachers
              isValid={!!this.state.model.valid_subscription}
              currentSort={this.state.currentSort}
              loading={this.state.loading}
              sortHandler={this.sortHandler()}
              data={teachers}
              columns={this.teacherColumns()}
            />
          </div>
        </div>
      );
    }
    return <span />;
  },
});
