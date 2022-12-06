import * as React from 'react';
import { mount } from 'enzyme';

import GradeLevelSection from '../grade_level_section';

describe('GradeLevelSection component', () => {

  it('should render', () => {
    const wrapper = mount(
      <GradeLevelSection
        maximumGradeLevel={null}
        minimumGradeLevel={null}
        setMaximumGradeLevel={jest.fn()}
        setMinimumGradeLevel={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
