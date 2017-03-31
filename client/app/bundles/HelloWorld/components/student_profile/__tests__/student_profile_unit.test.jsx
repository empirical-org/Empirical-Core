import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileUnit from '../student_profile_unit';

import StudentProfileActivities from '../student_profile_activities.jsx'

describe('StudentProfileUnit component', () => {

  it('should render unit name', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{unitName: 'Unit'}}
      />
    );
    expect(wrapper.find('h3.section-header').text()).toBe('Unit');
  });

  it('should render "Completed Activities" and "Assigned Activities" <StudentProfileActivities /> components if not_finished and finished are defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          not_finished: [{}, {}, {}],
          finished: [{}, {}]
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(2);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Assigned Activities');
    expect(wrapper.find(StudentProfileActivities).at(0).props().finished).toBe(false);
    expect(wrapper.find(StudentProfileActivities).at(0).props().data).toEqual([{}, {}, {}]);
    expect(wrapper.find(StudentProfileActivities).at(1).props().header).toBe('Completed Activities');
    expect(wrapper.find(StudentProfileActivities).at(1).props().finished).toBe(true);
    expect(wrapper.find(StudentProfileActivities).at(1).props().data).toEqual([{}, {}]);
  });

  it('should render only "Completed Activities" if not_finished is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          finished: [{}, {}]
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(1);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Completed Activities');
  });

  it('should render only "Assigned Activities" if finished is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          not_finished: [{}, {}, {}],
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(1);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Assigned Activities');
  });

});
