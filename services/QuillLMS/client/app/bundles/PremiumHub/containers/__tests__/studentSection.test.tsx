import * as React from "react";
import { render, screen } from "@testing-library/react";

import StudentSection from "../diagnosticGrowthReports/studentSection";

const props = {
  loadingFilters: true,
  customStartDate: null,
  customEndDate: null,
  pusherChannel: null,
  searchCount: 0,
  selectedClassrooms: [],
  allClassrooms: [],
  selectedGrades: [],
  allGrades: [],
  selectedSchools: [],
  selectedTeachers: [],
  allTeachers: [],
  selectedTimeframe: {
    label: "This school year",
    name: "This school year",
    value: "this-school-year"
  },
  handleClickDownloadReport: jest.fn(),
  openMobileFilterMenu: jest.fn()
}

describe('StudentSection', () => {
  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByAltText(/loading spinner/i)).toBeInTheDocument()
    })
  })
  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      props.loadingFilters = false
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('columnheader', { name: /student name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre to post: improved skills/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre: questions correct/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre: skills proficient/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /total activities & time spent/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /post: questions correct/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /post: skills improved or maintained/i })).toBeInTheDocument()
    })
    test('it should render the expected empty state message', () => {
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
  })
})
