import * as React from "react";
import { render, } from "@testing-library/react";

import ConceptReports from '../concept_reports'

jest.mock('../../../Teacher/components/modules/user_is_premium', () => jest.fn());

const mockProps = {
  csvData: [],
  schoolNames: [],
  switchSchool: () => jest.fn,
  selectedSchool: '',
  teacherNames: [],
  switchTeacher: () => jest.fn,
  selectedTeacher: '',
  classroomNames: [],
  switchClassroom: () => jest.fn,
  selectedClassroom: '',
  filteredClassroomsData: [],
}

describe('ConceptReports', () => {
  test('it should render', () => {
    const { asFragment } = render(<ConceptReports {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
