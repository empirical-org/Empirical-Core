import 'isomorphic-fetch'
import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from '../dashboard.jsx';
import ClassOverview from '../../components/dashboard/class_overview'
import MyClasses from '../../components/dashboard/my_classes'
import TeacherCenter from '../../components/dashboard/teacher_center'
import DashboardFooter from '../../components/dashboard/dashboard_footer'

describe('dashboard container', () => {
  const wrapper = shallow(
    <Dashboard
      onboardingChecklist={[
        {
          name: "Create a class",
          checked: true,
          link: "/teachers/classrooms?modal=create-a-class"
        },
        {
          name: "Add students",
          checked: true,
          link: "/teachers/classrooms"
        },
        {
          name: "Explore our library",
          checked: true,
          link: "/assign"
        },
        {
          name: "Explore our diagnostics",
          checked: true,
          link: "/assign/diagnostic"
        }
      ]}
      user={'{"name":"George Costanza","flag":"bosco"}'}
    />
  );

  it('initial state should match expectations', () => {
    expect(wrapper.state()).toEqual({
      classrooms: null,
      hasPremium: null,
      notifications: [],
      performanceQuery: [
        { header: 'Lowest Performing Students', results: null},
        { header: 'Difficult Concepts', results: null, }],
    });
  });

  describe('ClassOverview component', () => {
    it('should render', () => {
      expect(wrapper.find(ClassOverview).exists()).toBe(true);
    });

    it('should pass performanceQuery from state to data prop', () => {
      wrapper.setState({performanceQuery: () => {return 'foo'}});
      expect(wrapper.find(ClassOverview).props().data()).toBe('foo');
      wrapper.setState({performanceQuery: () => {return 'bar'}});
      expect(wrapper.find(ClassOverview).props().data()).toBe('bar');
    });

    it('should pass hasPremium from state to premium prop', () => {
      wrapper.setState({hasPremium: true});
      expect(wrapper.find(ClassOverview).props().premium).toBe(true);
      wrapper.setState({hasPremium: false});
      expect(wrapper.find(ClassOverview).props().premium).toBe(false);
    });

    it('should pass user flag from props to flag prop', () => {
      expect(wrapper.find(ClassOverview).props().flag).toBe('bosco');
    });
  });

  describe('MyClasses component', () => {
    it('should render only if there are classrooms in state', () => {
      expect(wrapper.find(MyClasses).exists()).toBe(false);
      wrapper.setState({classrooms: [{}]});
      expect(wrapper.find(MyClasses).exists()).toBe(true);
    });

    it('should pass classrooms to classList prop', () => {
      wrapper.setState({classrooms: [{foo: 'bar'}, {bar: 'foo'}]});
      expect(wrapper.find(MyClasses).props().classList).toHaveLength(2);
      expect(wrapper.find(MyClasses).props().classList[0].foo).toBe('bar');
      expect(wrapper.find(MyClasses).props().classList[1].bar).toBe('foo');
    });

    it('should pass user to user prop', () => {
      expect(wrapper.find(MyClasses).props().user.name).toBe('George Costanza');
    });
  });

  describe('TeacherCenter component', () => {
    it('should render', () => {
      expect(wrapper.find(TeacherCenter).exists()).toBe(true);
    });
  });

  describe('DashboardFooter component', () => {
    it('should render', () => {
      expect(wrapper.find(DashboardFooter).exists()).toBe(true);
    });
  });

  //TODO: test componentWillMount and componentWillUnmount after switching to request

});
