import React from 'react';
import { shallow } from 'enzyme';

import TeacherAccount from '../TeacherAccount.jsx';

describe('TeacherAccount container', () => {

  it('should have the expected initial state', () => {

  });

  describe.skip('componentDidMount', () => {
    // TODO: write these tests once we switch to requestjs
    it('call cms if account is type staff', () => {

    });

    it('should call teachers/my_account_data if account is not staff', () => {

    });
  });

  it('should render LoadingSpinner component if loading', () => {

  });

  describe('if the user is staff', () => {
    describe('SelectRole component', () => {
      it('should render', () => {

      });

      it('should have role prop based on state', () => {

      });

      it('should have updateRole prop that updates state', () => {

      });

      it('should have prop errors based on state', () => {

      });
    });

    describe('SelectSubscription component', () => {
      it('should render', () => {

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

      });

      it('should have role prop equal to state or teacher', () => {

      });

      it('should have updateRole prop that updates state', () => {

      });
    });

    describe('StaticDisplaySubscription component', () => {
      it('should render', () => {

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

      });

      it('have value based on state', () => {

      });

      it('should onChange prop that updates state', () => {

      });
    });
    it('should render email errors based on state', () => {

    });
  });

  it('should render user\'s name', () => {
    // George Costanza's Account
  });

  describe('input with ref name', () => {
    it('should render', () => {

    });

    it('should have value equal to state.name', () => {

    });

    it('should have an onChange event that changes state.name', () => {

    });
  });

  it('should render name errors', () => {

  });

  describe('input with ref username', () => {
    it('should render', () => {

    });

    it('should have value equal to state.username', () => {

    });

    it('should have an onChange event that changes state.username', () => {

    });
  });

  it('should render username errors', () => {

  });

  describe('input of type password with ref password', () => {
    it('should render', () => {

    });

    it('should have an onChange event that changes state.password', () => {

    });
  });

  it('should render password errors', () => {

  });

  describe('SelectSchool component', () => {
    it('should render', () => {

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

    });

    it('should have onChange prop that updates state', () => {

    });

    it('should have checked prop that returns checked depending on state', () => {

    });
  });

  describe('save button', () => {
    it('should render', () => {

    });

    describe.skip('onClick prop', () => {
      //TODO: write these tests once we implement requestjs
    });

    it('should have class button-grey if state.isSaving or button-green if not', () => {

    });
  });

  describe('delete button', () => {
    it('should render', () => {

    });

    describe('onClick prop', () => {
      //TODO: write these tests once we implement requestjs
    });
  });

});
