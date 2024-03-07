import * as React from "react";
import { render, screen } from "@testing-library/react";

import { RESTRICTED, LIMITED, FULL } from "../../shared";
import DiagnosticGrowthReports from "../diagnosticGrowthReports";

const props = {
  accessType: RESTRICTED,
  loadingFilters: true,
  pusherChannel: null,
  searchCount: 0,
  selectedClassrooms: [],
  availableClassrooms: [],
  selectedGrades: [],
  availableGrades: [],
  selectedSchools: [],
  availableTeachers: [],
  selectedTeachers: [],
  handleClickDownloadReport: jest.fn(),
  handleSetDisplayStudentCountsForFilters: jest.fn(),
  openMobileFilterMenu: jest.fn(),
  hasAdjustedFiltersFromDefault: false,
  passedData: null
}

describe('DiagnosticGrowthReports', () => {
  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      const loadingSpinner = screen.getByRole('img')
      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })
  describe('restricted state', () => {
    test('it should render locked icon', () => {
      props.loadingFilters = false
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('img', { name: /gray lock/i })).toBeInTheDocument()
    })
  })
  describe('limited state', () => {
    test('it should render locked icon', () => {
      props.accessType = LIMITED
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('img', { name: /gray lock/i })).toBeInTheDocument()
    })
  })
  describe('full state', () => {
    test('it should render the expected header components', () => {
      props.accessType = FULL
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('heading', { name: /diagnostic growth report/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance overview/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance by skill/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance by student/i })).toBeInTheDocument()
    })
    test('it should render expected messaging if there is no diagnostic data', () => {
      props.passedData = true
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('heading', { name: /there are not yet any completed diagnostics\./i})).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /how to assign a diagnostic/i })).toBeInTheDocument()
    })
  })
})
