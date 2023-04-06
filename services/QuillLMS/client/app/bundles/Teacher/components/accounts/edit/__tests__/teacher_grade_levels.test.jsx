import { mount } from 'enzyme';
import * as React from 'react';

import TeacherGradeLevels from '../teacher_grade_levels';

describe('TeacherGradeLevels component', () => {
  const props = {
    active: false,
    activateSection: jest.fn(),
    deactivateSection: jest.fn(),
    updateTeacherInfo: jest.fn(),
    passedMinimumGradeLevel: 1,
    passedMaximumGradeLevel: 12
  };

  it('should render', () => {
    const component = mount(<TeacherGradeLevels {...props} />);
    expect(component).toMatchSnapshot();
  });

});
