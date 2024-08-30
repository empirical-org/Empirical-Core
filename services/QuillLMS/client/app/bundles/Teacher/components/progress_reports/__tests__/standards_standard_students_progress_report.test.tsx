import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StandardsStandardStudentsProgressReport from '../standards_standard_students_progress_report';
import userIsPremium from '../../../../Teacher/components/modules/user_is_premium';

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StandardsStandardStudentsProgressReport', () => {
  beforeEach(() => {
    userIsPremium.mockReturnValue(true); // Mock premium user by default
  });

  test('it should render', () => {
    const { asFragment } = render(<StandardsStandardStudentsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('it should show "Not Scored" when proficient and not proficient counts are zero', () => {
    const mockStudentData = [
      {
        name: 'John Doe',
        proficient_standard_count: 0,
        not_proficient_standard_count: 0,
        average_score: 0,
        mastery_status: '',
        timespent: 0,
        student_standards_href: '#',
      },
    ];

    const mockDataResponse = {
      students: mockStudentData,
      standards: [{ name: 'Standard 1' }],
      classrooms: [{ name: 'Classroom 1' }],
      selected_classroom: { name: 'Classroom 1' },
      errors: null,
    };

    jest.spyOn(StandardsStandardStudentsProgressReport.prototype, 'getData').mockImplementation(function () {
      this.setState({
        loading: false,
        studentData: this.formattedStudentData(mockDataResponse.students),
        standard: mockDataResponse.standards[0],
        classrooms: mockDataResponse.classrooms,
        selectedClassroom: mockDataResponse.selected_classroom,
      });
    });

    render(<StandardsStandardStudentsProgressReport />);
    expect(screen.getAllByText('Not Scored')[0]).toBeInTheDocument();
  });

  test('it should not show "Not Scored" when proficient or not proficient counts are not zero', () => {
    const mockStudentData = [
      {
        name: 'Jane Doe',
        proficient_standard_count: 1,
        not_proficient_standard_count: 2,
        average_score: 0.85,
        mastery_status: 'Proficient',
        timespent: 3600,
        student_standards_href: '#',
      },
    ];

    const mockDataResponse = {
      students: mockStudentData,
      standards: [{ name: 'Standard 1' }],
      classrooms: [{ name: 'Classroom 1' }],
      selected_classroom: { name: 'Classroom 1' },
      errors: null,
    };

    jest.spyOn(StandardsStandardStudentsProgressReport.prototype, 'getData').mockImplementation(function () {
      this.setState({
        loading: false,
        studentData: this.formattedStudentData(mockDataResponse.students),
        standard: mockDataResponse.standards[0],
        classrooms: mockDataResponse.classrooms,
        selectedClassroom: mockDataResponse.selected_classroom,
      });
    });

    render(<StandardsStandardStudentsProgressReport />);
    expect(screen.queryByText('Not Scored')).not.toBeInTheDocument();
  });
});
