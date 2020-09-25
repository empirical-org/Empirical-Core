import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery'

import StudentProfile from '../StudentProfile.jsx';
import StudentProfileUnits from '../../components/student_profile/student_profile_units.jsx'

jest.mock('jquery', () => {
  return {
    ajax: jest.fn()
  }
});

const student = {
  name: 'student',
  classroom: {name: 'classroom', teacher: {name: 'teacher'}}
}

describe.skip('StudentProfile container', () => {
  const wrapper = shallow(<StudentProfile />);
  wrapper.setState({
    student,
    nextActivitySession: {
      name: 'Next Activty'
    },
    scores: [
      {
        name: 'First Score'
      },
      {
        name: 'Second Score'
      }
    ],
    loading: false
  });

  describe('StudentsClassroomsHeader component', () => {
    it('should render', () => {
      expect(wrapper.find(StudentsClassroomsHeader).exists()).toBe(true);
    });

    it('should have student data in data prop', () => {
      expect(wrapper.find(StudentsClassroomsHeader).props().data.name).toBe('student');
    });

    it('should have fetchData prop that fetches data', () => {
      wrapper.find(StudentsClassroomsHeader).props().fetchData(3);
      expect(wrapper.state().currentClassroom).toBe(3);
      expect(wrapper.state().loading).toBe(true);
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mock.calls[0][0].url).toBe('/student_profile_data');
      expect($.ajax.mock.calls[0][0].data.current_classroom_id).toBe(3);
      expect($.ajax.mock.calls[0][0].format).toBe('json');
      expect($.ajax.mock.calls[0][0].success).toBe(wrapper.instance().loadProfile);
    });
  });


  describe('StudentProfileUnits component', () => {
    it('should render', () => {
      expect(wrapper.find(StudentProfileUnits).exists()).toBe(true);
    });

    it('should have grouped scores in data prop', () => {
      expect(wrapper.find(StudentProfileUnits).props().data.food).toBe('bars');
    });

    it('should have loading prop based on state', () => {
      wrapper.setState({loading: true});
      expect(wrapper.find(StudentProfileUnits).props().loading).toBe(true);
      wrapper.setState({loading: false});
      expect(wrapper.find(StudentProfileUnits).props().loading).toBe(false);
    });
  });

  it('loadProfile function should update state', () => {
    const wrapper = shallow(<StudentProfile />);
    wrapper.instance().loadProfile({fudge: 'bags'});
    expect(wrapper.state().fudge).toBe('bags');
    expect(wrapper.state().ajaxReturned).toBe(true);
    expect(wrapper.state().loading).toBe(false);
    expect(wrapper.state().firstBatchLoaded).toBe(true);
  });

});
