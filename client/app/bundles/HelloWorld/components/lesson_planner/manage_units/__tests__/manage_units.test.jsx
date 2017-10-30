import React from 'react';
import { shallow } from 'enzyme';

import ManageUnits from '../manage_units.jsx';

import 'request';

jest.mock('request', () => {
  get: jest.fn()
});

const mockClassrooms = [
  {
    id: 42,
    name: 'Classroom A',
    code: 'cool-class',
    grade: '9',
    updated_at: '2017-03-26T18:20:50.848Z'
  }, {
    id: 43,
    name: 'Classroom B',
    code: 'coolish-course',
    grade: '8',
    updated_at: '2017-03-25T18:20:50.848Z'
  }
];

describe('ManageUnits component', () => {
  describe('initial state', () => {
    it('is set correctly', () => {
      const wrapper = shallow(<ManageUnits />);
      expect(wrapper.state().allUnits).toEqual([]);
      expect(wrapper.state().units).toEqual([]);
      expect(wrapper.state().loaded).toBe(false);
    });

    it('calls getClassrooms, hits the server, and calls handleClassrooms', () => {

    });
  });

  describe('handleClassrooms function', () => {
    describe('if there are classrooms', () => {
      it('sets classrooms in state', () => {

      });

      it('calls getUnits', () => {

      });
    });

    it('sets state properly if there are no classrooms', () => {

    });
  });

  describe('getUnitsForCurrentClass', () => {
    it('sets state to correct units if there is a selected classroom', () => {

    });

    it('sets state to all units if there is no selected classroom', () => {

    });
  });

  // TODO: write separate tests for generateNewCaUnit, parseUnits, and
  // orderUnits once these are pulled out into their own module.
  // (See https://github.com/empirical-org/Empirical-Core/issues/3019
  // under the 'High Priority' heading for more information.)

  it('setAllUnits calls parseUnits and getUnitsForCurrentClass', () => {

  });

  describe('hideUnit', () => {
    it('updates state appropriately', () => {

    });

    it('calls the correct API endpoint with authenticity_token', () => {

    });
  });

  describe('hideClassroomActivity', () => {
    it('sets state to reflect removed classroomActivity', () => {

    });

    it('calls the API with an appropriate authenticity_token', () => {

    });
  });

  it('updateDueDate calls the correct endpoint with the right data', () => {

  });

  describe('switchClassrooms', () => {
    it('updates window.history correctly if there is a classroom', () => {

    });

    it('updates window.history correctly if there is no classroom', () => {

    });

    it('updates state and calls getUnitsForCurrentClass', () => {

    });
  });

  it('getIdFromUnit gets the id from unit in both formats', () => {

  });

  describe('stateBasedComponent function', () => {
    describe('when there are no units', () => {
      it('renders a message if there is a selected classroom', () => {

      });

      it('renders a message if there no selected classroom', () => {

      });
    });

    it('renders a loading indicator if state is loading', () => {

    });

    it('renders a Units component with appropriate props', () => {

    });

    it('renders a ManageUnitsHeader component', () => {

    });

    it('renders a ClassroomDropdown component with correct props', () => {

    });
  });

});
