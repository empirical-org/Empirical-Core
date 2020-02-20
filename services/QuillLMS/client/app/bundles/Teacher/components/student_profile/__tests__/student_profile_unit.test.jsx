import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileUnit from '../student_profile_unit';

describe('StudentProfileUnit component', () => {

  it('should render unit name', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{complete: [{unit_name: 'Unit' }]}}
        unitName="Unit"
      />
    );
    expect(wrapper.find('.unit-name').text()).toBe('Unit');
  });

  it('should render "Completed Activities" and "Assigned Activities" <StudentProfileActivities /> components if incomplete and complete are defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          incomplete: [{unit_name: 'Incomplete' }, {unit_name: 'Incomplete' }, {unit_name: 'Incomplete' }],
          complete: [{unit_name: 'Complete' }, {unit_name: 'Complete' }]
        }}
        unitName="Unit"
      />
    );
  });

  it('should render only "Completed Activities" if incomplete is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          complete: [{unit_name: 'Complete' }, {unit_name: 'Complete' }]
        }}
        unitName="Complete"
      />
    );
  });

  it('should render only "Assigned Activities" if complete is not defined', () => {
    const wrapper = shallow(
      <StudentProfileUnit
        data={{
          incomplete: [{unit_name: 'Incomplete' }, {unit_name: 'Incomplete' }, {unit_name: 'Incomplete' }],
        }}
        unitName="Incomplete"
      />
    );
  });

});
