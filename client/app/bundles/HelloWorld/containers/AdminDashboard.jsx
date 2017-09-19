//= require ./../general_components/table/sortable_table/table_sorting_mixin.js
import React from 'react';
import TableSortingMixin from '../components/general_components/table/sortable_table/table_sorting_mixin.js';
import _ from 'underscore';
import AdminsTeachers from '../components/admin_dashboard/admins_teachers/admins_teachers.jsx';
import PremiumFeatures from '../components/admin_dashboard/premium_features';
import CreateNewAccounts from '../components/admin_dashboard/create_new_accounts.jsx';
import pluralize from 'pluralize';
import request from 'request'
import getAuthToken from '../components/modules/get_auth_token'

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
    this.getData()
  },

  getData() {
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

  addTeacherAccount(data) {
    const that = this
    that.setState({message: '', error: ''})
    data.authenticity_token = getAuthToken()
    request.post(`${process.env.DEFAULT_URL}/admins/${that.props.id}/teachers`, {
      json: data
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        that.setState({message: response.message}, () => that.getData())
      } else {
        console.log(response)
      }
    })
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
    const teachers = this.state.model.teachers ? this.applySorting(this.state.model.teachers) : [];
    if (!this.state.loading) {
      return (
        <div >
          <div className="sub-container">
            <PremiumFeatures/>
            <AdminsTeachers
              isValid={!!this.state.model.valid_subscription}
              currentSort={this.state.currentSort}
              loading={this.state.loading}
              sortHandler={this.sortHandler()}
              data={teachers}
              columns={this.teacherColumns()}
            />
            <CreateNewAccounts
              schools={this.state.model.schools}
              addTeacherAccount={this.addTeacherAccount}
              error={this.state.error}
              message={this.state.message}
            />
          </div>
        </div>
      );
    }
    return <span />;
  },
});
