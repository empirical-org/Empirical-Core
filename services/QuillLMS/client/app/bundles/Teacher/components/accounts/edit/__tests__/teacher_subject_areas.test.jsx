import * as React from 'react';
import { mount } from 'enzyme';

import { subjectAreas, } from '../../shared/__tests__/data'

import TeacherSubjectAreas from '../teacher_subject_areas';

describe('TeacherSubjectAreas component', () => {
  const props = {
    active: false,
    activateSection: jest.fn(),
    deactivateSection: jest.fn(),
    updateTeacherInfo: jest.fn(),
    passedSelectedSubjectAreaIds: [subjectAreas[0].id],
    subjectAreas: []
  };

  it('should render', () => {
    const component = mount(<TeacherSubjectAreas {...props} />);
    expect(component).toMatchSnapshot();
  });

});
