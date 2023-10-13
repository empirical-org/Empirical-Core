import * as React from "react";
import { render, screen } from "@testing-library/react";

import { RESTRICTED, LIMITED, FULL } from "../../shared";
import DiagnosticGrowthReports from "../diagnosticGrowthReports";

const props = {
  accessType: RESTRICTED,
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
      expect(screen.getByRole('button', { name: /manage subscription/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance overview/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance by skill/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /performance by student/i })).toBeInTheDocument()
    })
    test('it should render the overview table', () => {
      const { asFragment } = render(<DiagnosticGrowthReports {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('columnheader', { name: /diagnostic name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /pre diagnostic completed/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /completed activities/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /average activities & time spent/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /post diagnostic completed/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /overall skill growth/i })).toBeInTheDocument()
    })
  })
})