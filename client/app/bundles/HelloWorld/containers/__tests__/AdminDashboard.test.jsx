import React from 'react';
import { shallow } from 'enzyme';

import AdminDashboard from '../AdminDashboard.jsx';

import AdminDashboardTop from '../../components/admin_dashboard/admin_dashboard_top.jsx'
import InviteUsers from '../../components/invite_users/invite_users.jsx'
import AdminsTeachers from '../../components/admin_dashboard/admins_teachers/admins_teachers.jsx'

describe('AdminDashboard container', () => {
  const wrapper = shallow(<AdminDashboard id={7} />);

  it('should render an AdminDashboardTop component', () => {
    expect(wrapper.find(AdminDashboardTop).exists()).toBe(true);
  });

  describe('InviteUsers component', () => {
    it('should render', () => {
      expect(wrapper.find(InviteUsers).exists()).toBe(true);
    });

    it('data prop should have invite users data', () => {
      wrapper.setState({newTeacher: {foo: 'bar'}});
      expect(wrapper.find(InviteUsers).props().data.model.foo).toBe('bar');
      expect(wrapper.find(InviteUsers).props().data.userType).toBe('Teacher');
      expect(wrapper.find(InviteUsers).props().data.update).toBe(wrapper.instance().updateNewTeacher);
      expect(wrapper.find(InviteUsers).props().data.save).toBe(wrapper.instance().saveNewTeacher);
    });

    it('actions prop should have invite users actions', () => {
      expect(wrapper.find(InviteUsers).props().actions.update).toBe(wrapper.instance().updateNewTeacher);
      expect(wrapper.find(InviteUsers).props().actions.save).toBe(wrapper.instance().saveNewTeacher);
    });
  });

  describe('AdminsTeachers component', () => {
    it('should render', () => {
      expect(wrapper.find(AdminsTeachers).exists()).toBe(true);
    });

    it('should have currentSort prop based on state', () => {
      wrapper.setState({currentSort: 'arbitrary'});
      expect(wrapper.find(AdminsTeachers).props().currentSort).toBe('arbitrary');
    });

    it('should have loading prop based on state', () => {
      wrapper.setState({loading: false});
      expect(wrapper.find(AdminsTeachers).props().loading).toBe(false);
    });

    it.skip('should have sort handler prop equal to sortHandler function', () => {
      //TODO: write a test for sortHandler... I'm not really sure what's going on here.
      // expect(wrapper.find(AdminsTeachers).props().sortHandler).toBe();
    });

    it.skip('should have data prop equal to sorted teachers', () => {
      // this could be a tough one
    });

    it('have columns prop equal to teacherColumns function', () => {
      expect(wrapper.find(AdminsTeachers).props().columns).toEqual(
        [
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
      );
    });
  });

  it('updateNewTeacher function should update state', () => {
    wrapper.instance().updateNewTeacher('key', 'val');
    expect(wrapper.state().newTeacher['key']).toBe('val');
  });

  it.skip('saveNewTeacher function should send post request with appropriate data', () => {
    //TODO: change ajax to request and test this
    // wrapper.setState({newTeacher: {foo: 'bar'}});
    // wrapper.instance().saveNewTeacher();
    // expect($.ajax).toHaveBeenCalled();
    // expect($.ajax.mock.calls[0][0].url).toBe('/admins/7/teachers');
    // expect($.ajax.mock.calls[0][0].type).toBe('POST');
    // expect($.ajax.mock.calls[0][0].success).toBe(wrapper.instance().saveNewTeacherSuccess);
    // expect($.ajax.mock.calls[0][0].data.teacher.foo).toBe('bar');
  });

  // sortDefinitions
  // componentDidMount
  // receiveData

});
