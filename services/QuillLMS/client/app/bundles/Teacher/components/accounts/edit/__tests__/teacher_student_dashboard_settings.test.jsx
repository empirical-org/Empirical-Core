import * as React from 'react';
import { render, } from '@testing-library/react';

import TeacherStudentDashboardSettings from '../teacher_student_dashboard_settings';

describe('TeacherStudentDashboardSettings component', () => {
  const props = {
    active: false,
    activateSection: jest.fn(),
    deactivateSection: jest.fn(),
    updateTeacherInfo: jest.fn(),
    showStudentsExactScore: true,
  };

  it('should render', () => {
    const { asFragment, } = render(<TeacherStudentDashboardSettings {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

});
