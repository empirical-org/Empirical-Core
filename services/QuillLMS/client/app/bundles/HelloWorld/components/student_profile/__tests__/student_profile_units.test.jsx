import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileUnits from '../student_profile_units';

import StudentProfileUnit from '../student_profile_unit';

describe('StudentProfileUnits component', () => {

  it('should render <StudentProfileUnit /> components with correct props', () => {
    const wrapper = shallow(
      <StudentProfileUnits
        data={{
          '0': {unit_id: 1, unit_name: 'Same ID'},
          '1': {unit_id: 1, unit_name: 'Same ID'},
          '2': {unit_id: 2, unit_name: 'Different'},
        }}
      />
    );
    expect(wrapper.find(StudentProfileUnit).length).toBe(2);
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[0].unit_name).toBe('Same ID');
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[1].unit_name).toBe('Same ID');
    expect(wrapper.find(StudentProfileUnit).at(1).props().data.incomplete[0].unit_name).toBe('Different');
  });

  it('should render LOADING if loading', () => {
    const wrapper = shallow(
      <StudentProfileUnits
        data={{}}
        loading={true}
      />
    );
    expect(wrapper.find('.container').html()).toBe('<div class="container">LOADING</div>');
  });

});
