import React from 'react';
import { shallow, mount } from 'enzyme';

import TeacherAccount from '../TeacherAccount.jsx';
import SelectRole from '../../components/accounts/edit/select_role';
import UserSelectRole from '../../components/accounts/edit/user_accessible_select_role.jsx';
import SelectSubscription from '../../components/accounts/subscriptions/select_subscription';
import StaticDisplaySubscription from '../../components/accounts/subscriptions/static_display_subscription';
import SelectSchool from '../../components/accounts/school/select_school';
import LoadingSpinner from '../../components/shared/loading_indicator.jsx'

describe('TeacherAccount container', () => {
  // Sadly, we have to mount here instead of using shallow
  // because the TeacherAccount container uses quite a few
  // refs for input fields. In order to test these, we need
  // to use mount because shallow does not play with refs.
  const wrapper = mount(
    <TeacherAccount
      userType='teacher'
      teacherId={7}
    />
  );
  const wrapperStaff = mount(
    <TeacherAccount
      userType='staff'
    />
  );
  wrapper.setState({loading: false});
  wrapperStaff.setState({loading: false});

  it('should have the expected initial state', () => {
    expect(shallow(<TeacherAccount userType='arbitrary' teacherId={4} />).state()).toEqual({
      id: 4,
			name: '',
			username: '',
			email: '',
			isSaving: false,
			selectedSchool: null,
			originalSelectedSchool: null,
			schoolOptions: [],
			schoolOptionsDoNotApply: false,
			role: 'teacher',
			password: null,
			loading: true,
			errors: {},
			subscription: {
				id: null,
				expiration: '2016-01-01',
				account_limit: null
			}
    });
  });

  describe.skip('componentDidMount', () => {
    // TODO: write these tests once we switch to requestjs
    it('call cms if account is type staff', () => {

    });

    it('should call teachers/my_account_data if account is not staff', () => {

    });
  });

  it('should render LoadingSpinner component if loading', () => {
    wrapper.setState({loading: true});
    expect(wrapper.find(LoadingSpinner).exists()).toBe(true);
    wrapper.setState({loading: false});
    expect(wrapper.find(LoadingSpinner).exists()).toBe(false);
  });

  describe('if the user is staff', () => {
    describe('SelectRole component', () => {
      it('should render', () => {
        expect(wrapperStaff.find(SelectRole).exists()).toBe(true);
      });

      it('should have role prop based on state', () => {

      });

      it('should have updateRole prop that updates state', () => {

      });

      it('should have prop errors based on state', () => {

      })
    });

    describe('SelectSubscription component', () => {
      it('should render', () => {
        expect(wrapperStaff.find(SelectSubscription).exists()).toBe(true);
      });

      it('should have prop subscription based on state', () => {

      });

      it('should have prop updateSubscriptionType that updates state', () => {

      });

      it('should have prop updateSubscriptionState that updates state', () => {

      });
    });
  });

  describe('if the user is not staff', () => {
    describe('UserSelectRole component', () => {
      it('should render', () => {
        expect(wrapper.find(UserSelectRole).exists()).toBe(true);
      });

      it('should have role prop equal to state or teacher', () => {

      });

      it('should have updateRole prop that updates state', () => {

      });
    });

    describe('StaticDisplaySubscription component', () => {
      it('should render', () => {
        expect(wrapper.find(StaticDisplaySubscription).exists()).toBe(true);
      });

      it('should have subscription prop based on state', () => {

      });
    });
  });

  describe('if the user uses google', () => {
    describe('if the user is staff', () => {
      describe('input with ref email', () => {
        it('should render', () => {

        });

        it('should have class inactive', () => {

        });

        it('should have value depending on state', () => {

        });

        it('should have readOnly flag', () => {

        });
      });
    });

    describe('if the user is not staff', () => {
      it('should not display input with ref email', () => {

      });
    });
  });

  describe('if the user does not use google', () => {
    describe('input with ref email', () => {
      it('should render', () => {
        expect(wrapper.ref('email').exists()).toBe(true);
      });

      it('have value based on state', () => {

      });

      it('should onChange prop that updates state', () => {

      });
    });
    it('should render email errors based on state', () => {
      wrapper.setState({errors: {email: 'I am error'}});
      expect(wrapper.text()).toMatch('I am error');
    });
  });

  it('should render user\'s name', () => {
    wrapper.setState({name: 'George Costanza'});
    expect(wrapper.text()).toMatch('George Costanza\'s Account');
  });

  describe('input with ref name', () => {
    it('should render', () => {
      expect(wrapper.ref('name').exists()).toBe(true);
    });

    it('should have value equal to state.name', () => {

    });

    it('should have an onChange event that changes state.name', () => {

    });
  });

  it('should render name errors based on state', () => {
    wrapper.setState({errors: {name: 'I am error'}});
    expect(wrapper.text()).toMatch('I am error');
  });

  describe('input with ref username', () => {
    it('should render', () => {
      expect(wrapper.ref('username').exists()).toBe(true);
    });

    it('should have value equal to state.username', () => {

    });

    it('should have an onChange event that changes state.username', () => {

    });
  });

  it('should render username errors based on state', () => {
    wrapper.setState({errors: {username: 'I am error'}});
    expect(wrapper.text()).toMatch('I am error');
  });

  describe('input of type password with ref password', () => {
    it('should render', () => {
      expect(wrapper.ref('password').exists()).toBe(true);
    });

    it('should have an onChange event that changes state.password', () => {

    });
  });

  it('should render password errors based on state', () => {
    wrapper.setState({errors: {password: 'I am error'}});
    expect(wrapper.text()).toMatch('I am error');
  });

  describe('SelectSchool component', () => {
    it('should render', () => {
      expect(wrapper.find(SelectSchool).exists()).toBe(true);
    });

    it('should have errors prop depending on state', () => {

    });

    it('should have selectedSchool prop based on state', () => {

    });

    it('should have schoolOptions prop based on state', () => {

    });

    it.skip('should have requestSchools prop that fires ajax call to schools.json', () => {
      // TODO: write this test once we switch over to request from jQuery
    });

    it('should have updateSchool prop that changes state', () => {

    });
  });

  describe('input with ref schoolOptionsDoNotApply', () => {
    it('should render', () => {
      expect(wrapper.ref('schoolOptionsDoNotApply').exists()).toBe(true);
    });

    it('should have onChange prop that updates state', () => {
      expect(wrapper.state().schoolOptionsDoNotApply).toBe(false);
      wrapper.ref('schoolOptionsDoNotApply').props().onChange();
      expect(wrapper.state().schoolOptionsDoNotApply).toBe(true);
      wrapper.ref('schoolOptionsDoNotApply').props().onChange();
      expect(wrapper.state().schoolOptionsDoNotApply).toBe(false);
    });

    it('should have checked prop that returns checked depending on state', () => {
      wrapper.setState({schoolOptionsDoNotApply: true});
      expect(wrapper.ref('schoolOptionsDoNotApply').props().checked).toBe(true)
      wrapper.setState({schoolOptionsDoNotApply: false});
      expect(wrapper.ref('schoolOptionsDoNotApply').props().checked).toBe(false)
    });
  });

  describe('save button', () => {
    it('should render', () => {
      expect(wrapper.find('button').filterWhere(e => e.text() == 'Save Changes').exists()).toBe(true);
    });

    describe.skip('onClick prop', () => {
      //TODO: write these tests once we implement requestjs
    });

    it('should have class button-grey if state.isSaving or button-green if not', () => {
      wrapper.setState({isSaving: true});
      expect(wrapper.find('button').filterWhere(e => e.text() == 'Save Changes').props().className).toBe('button-grey');
      wrapper.setState({isSaving: false});
      expect(wrapper.find('button').filterWhere(e => e.text() == 'Save Changes').props().className).toBe('button-green');
    });
  });

  describe('delete button', () => {
    it('should render', () => {
      expect(wrapper.find('.delete-account').exists()).toBe(true);
    });

    describe.skip('onClick prop', () => {
      //TODO: write these tests once we implement requestjs
    });
  });

});
