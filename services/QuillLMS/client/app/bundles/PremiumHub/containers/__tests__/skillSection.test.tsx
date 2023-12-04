import * as React from "react";
import { render, screen } from "@testing-library/react";

import SkillSection from "../diagnosticGrowthReports/skillSection";

const props = {
  loadingFilters: true,
  customStartDate: null,
  customEndDate: null,
  pusherChannel: null,
  searchCount: 0,
  selectedClassrooms: [],
  availableClassrooms: [],
  selectedGrades: [],
  availableGrades: [],
  selectedSchools: [],
  selectedTeachers: [],
  availableTeachers: [],
  selectedTimeframe: {
    label: "This school year",
    name: "This school year",
    value: "this-school-year"
  },
  handleClickDownloadReport: jest.fn(),
  openMobileFilterMenu: jest.fn()
}

describe('SkillSection', () => {
  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<SkillSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByAltText(/loading spinner/i)).toBeInTheDocument()
    })
  })
  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      props.loadingFilters = false
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
