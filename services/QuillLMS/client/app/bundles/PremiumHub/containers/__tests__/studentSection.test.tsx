import * as React from "react";
import { render, screen } from "@testing-library/react";

import * as requestsApi from '../../../../modules/request';
import StudentSection from "../diagnosticGrowthReports/studentSection";

const props = {
  searchCount: 0,
  selectedGrades: [],
  selectedSchoolIds: [],
  selectedTeacherIds: [],
  selectedClassroomIds: [],
  selectedTimeframe: "This school year",
  pusherChannel: null,
  handleSetTotalStudentCountForFilters: jest.fn(),
  handleSetTotalStudentMatchesForFilters: jest.fn(),
  handleSetDisplayStudentCountsForFilters: jest.fn(),
  passedVisibleData: null
}

describe('StudentSection', () => {
  beforeEach(() => {
    jest.spyOn(requestsApi, 'requestPost').mockImplementation((url, params, callback) => {
      callback([]);
    });
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<StudentSection {...props} />);

      expect(asFragment()).toMatchSnapshot();
      const loadingSpinner = screen.getByRole('img')

      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })

  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      props.passedVisibleData = []
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
      props.passedVisibleData = []
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
  })
})
