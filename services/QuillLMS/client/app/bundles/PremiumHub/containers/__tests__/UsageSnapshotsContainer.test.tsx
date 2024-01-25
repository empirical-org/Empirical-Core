import * as React from "react";
import { render, screen, fireEvent, } from "@testing-library/react";
import { RESTRICTED, LIMITED, FULL } from "../../shared";
import UsageSnapshotsContainer from "../UsageSnapshotsContainer";

const props = {
  accessType: RESTRICTED,
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
  openMobileFilterMenu: jest.fn(),
  saveFilterSelections: jest.fn(),
}

describe('UsageSnapshotsContainer', () => {
  describe('loading state', () => {
    test('it should render', () => {
      const { asFragment } = render(<UsageSnapshotsContainer {...props} />);
      expect(asFragment()).toMatchSnapshot();
      const loadingSpinner = screen.getByRole('img')
      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })
  describe('restricted state', () => {
    test('it should render', () => {
      props.loadingFilters = false
      const { asFragment } = render(<UsageSnapshotsContainer {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('img', { name: /gray lock/i })).toBeInTheDocument()
    })
  })
  describe('limited state', () => {
    test('it should render', () => {
      props.accessType = LIMITED
      const { asFragment } = render(<UsageSnapshotsContainer {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('img', { name: /gray lock/i })).toBeInTheDocument()
    })
  })
  describe('full state', () => {
    beforeEach(() => {
      props.accessType = FULL;
    });

    test('it should render', () => {
      const { asFragment } = render(<UsageSnapshotsContainer {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('heading', { name: /usage snapshot report/i })).toBeInTheDocument()
    })

    test('it should render with subscription button', () => {
      render(<UsageSnapshotsContainer {...props} />);
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    test('clicking on subscribe button opens subscription modal', () => {
      render(<UsageSnapshotsContainer {...props} />);
      const subscribeButton = screen.getByText('Subscribe');
      fireEvent.click(subscribeButton);

      const modalTitle = screen.queryByText("Subscribe to this report");
      expect(modalTitle).toBeInTheDocument();

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toBeInTheDocument();
    });
  })
})
