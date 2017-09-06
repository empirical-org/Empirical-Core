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

  it('should render "Completed Activities" and "Assigned Activities" <StudentProfileActivities /> components if incomplete and complete are defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          incomplete: [{}, {}, {}],
          complete: [{}, {}]
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(2);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Assigned Activities');
    expect(wrapper.find(StudentProfileActivities).at(0).props().complete).toBe(false);
    expect(wrapper.find(StudentProfileActivities).at(0).props().data).toEqual([{}, {}, {}]);
    expect(wrapper.find(StudentProfileActivities).at(1).props().header).toBe('Completed Activities');
    expect(wrapper.find(StudentProfileActivities).at(1).props().complete).toBe(true);
    expect(wrapper.find(StudentProfileActivities).at(1).props().data).toEqual([{}, {}]);
  });

  it('should render only "Completed Activities" if incomplete is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          complete: [{}, {}]
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(1);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Completed Activities');
  });

  it('should render only "Assigned Activities" if complete is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          unitName: 'Unit',
          incomplete: [{}, {}, {}],
        }}
      />
    );
    expect(wrapper.find(StudentProfileActivities).length).toBe(1);
    expect(wrapper.find(StudentProfileActivities).at(0).props().header).toBe('Assigned Activities');
  });

});
