import * as React from "react";
import { render, screen } from "@testing-library/react";

import SkillSection from "../diagnosticGrowthReports/skillSection";

const props = {
  searchCount: 0,
  selectedGrades: [],
  selectedSchoolIds: [],
  selectedTeacherIds: [],
  selectedClassroomIds: [],
  selectedTimeframe: "This school year",
  pusherChannel: null,
  hasAdjustedFiltersFromDefault: false,
  handleSetNoDiagnosticDataAvailable: jest.fn()
}

describe('SkillSection', () => {
  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      const { asFragment } = render(<SkillSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('button', { name: /skill/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre skill score/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /post skill score/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /growth results/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /students improved skill/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /students recommended practice/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /students maintained proficiency/i })).toBeInTheDocument()
    })
    test('it should render the expected empty state message', () => {
      const { asFragment } = render(<SkillSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
  })
})
