import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileUnits from '../student_profile_units';

import StudentProfileUnit from '../student_profile_unit';

describe('StudentProfileUnits component', () => {

  it('should render <StudentProfileUnit /> components with correct props', () => {
    const wrapper = shallow(
      <StudentProfileUnits
        data={{
          'Example Key': {},
          'Other Example': {}
        }}
      />
    );
    expect(wrapper.find(StudentProfileUnit).length).toBe(2);
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.unitName).toBe('Example Key');
    expect(wrapper.find(StudentProfileUnit).at(1).props().data.unitName).toBe('Other Example');
  });

  it('should render nothing if loading', () => {
    const wrapper = shallow(
      <StudentProfileUnits
        data={{}}
        loading={true}
      />
    );
    expect(wrapper.find('.container').html()).toBe('<div class="container"></div>');
  });

});
