// TODO: write separate tests for generateNewCaUnit, parseUnits, and
// orderUnits once these are pulled out into their own module.
// (See https://github.com/empirical-org/Empirical-Core/issues/3019
// under the 'High Priority' heading for more information.)

import { shallow } from 'enzyme';
import React from 'react';

import ManageUnits from '../manage_units.jsx';

jest.mock('../../../modules/get_parameter_by_name', () => jest.fn());
const getParameterByName = require('../../../modules/get_parameter_by_name');

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
    code: 'cooler-course',
    grade: '8',
    updated_at: '2017-03-25T18:20:50.848Z'
  }
];

const mockUnits = [
  {
    "unit_name":"Unit A",
    "activity_name":"Activity 1",
    "supporting_info":null,
    "class_name":"Classroom A",
    "classroom_id":"42",
    "activity_classification_id":"5",
    "classroom_activity_id":"123456",
    "unit_id":"12345",
    "array_length":"5",
    "class_size":"30",
    "due_date":"2018-04-04 04:00:00",
    "activity_id":"431",
    "activity_uid":"-KR_OwdfOU1BvVybObtt",
    "completed_count":"145",
    "unit_created_at":"1490615979.60335",
    "classroom_activity_created_at":"1490615979.61671"
  },
  {
    "unit_name":"Unit A",
    "activity_name":"Activity 1",
    "supporting_info":null,
    "class_name":"Classroom B",
    "classroom_id":"43",
    "activity_classification_id":"5",
    "classroom_activity_id":"123456",
    "unit_id":"12345",
    "array_length":"5",
    "class_size":"30",
    "due_date":"2018-04-04 04:00:00",
    "activity_id":"431",
    "activity_uid":"-KR_OwdfOU1BvVybObtt",
    "completed_count":"145",
    "unit_created_at":"1490615979.60335",
    "classroom_activity_created_at":"1490615979.61671"
  },
  {
    "unit_name":"Unit B",
    "activity_name":"Activity 2",
    "supporting_info":null,
    "class_name":"Classroom A",
    "classroom_id":"42",
    "activity_classification_id":"5",
    "classroom_activity_id":"123456",
    "unit_id":"12345",
    "array_length":"5",
    "class_size":"30",
    "due_date":"2018-04-04 04:00:00",
    "activity_id":"431",
    "activity_uid":"-KR_OwdfOU1BvVybObtt",
    "completed_count":"145",
    "unit_created_at":"1490615979.60335",
    "classroom_activity_created_at":"1490615979.61671"
  }
];

// We're going to skip these tests until we fix up the module for
// generateNewCaUnit, parseUnits, and orderUnits.
describe.skip('ManageUnits component', () => {
  describe('initial state', () => {
    const wrapper = shallow(<ManageUnits />);

    it('is set correctly', () => {
      expect(wrapper.state().allUnits).toEqual([]);
      expect(wrapper.state().units).toEqual([]);
      expect(wrapper.state().loaded).toBe(false);
    });

    it('calls getClassrooms', () => {
      wrapper.instance().getClassrooms = jest.fn();
      // Let's call getInitialState again after mocking getClassrooms
      // so that the mock gets called this time.
      wrapper.instance().getInitialState();
      expect(wrapper.instance().getClassrooms).toHaveBeenCalled();
    });

    it('calls getParameterByName', () => {
      expect(getParameterByName).toHaveBeenCalled();
      expect(getParameterByName.mock.calls[0][0]).toBe('classroom_id');
    });
  });

  // TODO: write test for get classrooms

  describe('handleClassrooms function', () => {
    const wrapper = shallow(<ManageUnits />);
    wrapper.instance().getUnits = jest.fn();

    describe('if there are classrooms', () => {
      wrapper.instance().handleClassrooms(mockClassrooms);

      it('sets classrooms in state', () => {
        expect(wrapper.state().classrooms).toEqual(mockClassrooms);
      });

      it('calls getUnits', () => {
        expect(wrapper.instance().getUnits).toHaveBeenCalled();
      });
    });

    it('sets state properly if there are no classrooms', () => {
      wrapper.instance().handleClassrooms([]);
      expect(wrapper.state().empty).toBe(true);
      expect(wrapper.state().loaded).toBe(true);
    });
  });

  describe('getUnitsForCurrentClass', () => {
    const wrapper = shallow(<ManageUnits actions={{editUnit: null}} />);
    wrapper.setState({ allUnits: mockUnits, units: mockUnits, classrooms: mockClassrooms });

    // skip for now because parseUnits isn't tested and this relies on
    // our data being transformed by parseunits
    it.skip('sets state to correct units if there is a selected classroom', () => {
      wrapper.setState({ selectedClassroomId: 42 });
      wrapper.instance().getUnitsForCurrentClass();
      expect(wrapper.state().units).toEqual(
        mockUnits.filter(u => u.classroom_id == Number(wrapper.state().selectedClassroomId))
      );
    });

    it('sets state to all units if there is no selected classroom', () => {
      wrapper.instance().getUnitsForCurrentClass();
      expect(wrapper.state().units).toEqual(mockUnits);
    });
  });

  it('setAllUnits calls parseUnits and getUnitsForCurrentClass', () => {
    const arbitraryData = {arbitrary: 'datum'};
    const wrapper = shallow(<ManageUnits />);
    wrapper.instance().parseUnits = jest.fn();
    wrapper.instance().getUnitsForCurrentClass = jest.fn();
    wrapper.instance().setAllUnits(arbitraryData);
    expect(wrapper.instance().parseUnits).toHaveBeenCalled();
    expect(wrapper.instance().parseUnits.mock.calls[0][0]).toEqual(arbitraryData);
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

    it('renders a ItemDropdown component with correct props', () => {

    });
  });

});
