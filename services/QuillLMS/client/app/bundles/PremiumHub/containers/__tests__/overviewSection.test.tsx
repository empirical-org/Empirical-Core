import * as React from "react";
import { render, screen } from "@testing-library/react";

import OverviewSection from "../diagnosticGrowthReports/overviewSection";

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

describe('OverviewSection', () => {
  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<OverviewSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      const loadingSpinner = screen.getByRole('img')
      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })
  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      props.loadingFilters = false
      const { asFragment } = render(<OverviewSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('columnheader', { name: /diagnostic name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre diagnostic completed/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /completed activities/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /average activities & time spent/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /post diagnostic completed/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /overall skill growth/i })).toBeInTheDocument()
    })
    test('it should render the expected empty state message', () => {
      const { asFragment } = render(<OverviewSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
  })
})
