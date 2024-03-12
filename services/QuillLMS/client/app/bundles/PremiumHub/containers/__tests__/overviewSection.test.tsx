import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import * as requestsApi from '../../../../modules/request';
import OverviewSection from "../diagnosticGrowthReports/overviewSection";

const props = {
  searchCount: 0,
  selectedGrades: [],
  selectedSchoolIds: [],
  selectedTeacherIds: [],
  selectedClassroomIds: [],
  selectedTimeframe: "This school year",
  pusherChannel: null,
  hasAdjustedFiltersFromDefault: false,
  handleSetNoDiagnosticDataAvailable: jest.fn(),
  handleTabChangeFromDataChip: jest.fn(),
  handleSetDiagnosticIdForStudentCount: jest.fn(),
  handleSetSelectedDiagnosticId: jest.fn(),
  handleSetSelectedGroupByValue: jest.fn(),
  passedData: null
}

const mockData = [
  {
    id: 1663,
    name: "Starter Baseline Diagnostic (Pre)",
    preDiagnosticCompleted: '57 of 65 Students',
    studentsCompletedPractice: "58 Students",
    averageActivitiesAndTimeSpent: "17 Activities (26:35)",
    postDiagnosticCompleted: "27 of 65 Students",
    overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+20%</button>,
    aggregate_rows: [
      {
        id: 7,
        name: "Grade 7",
        preDiagnosticCompleted: '27 of 35 Students',
        studentsCompletedPractice: "50 Students",
        averageActivitiesAndTimeSpent: "12 Activities (26:35)",
        postDiagnosticCompleted: "17 of 35 Students",
        overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+10%</button>,
      },
      {
        id: 9,
        name: "Grade 9",
        preDiagnosticCompleted: '30 of 30 Students',
        studentsCompletedPractice: "9 Students",
        averageActivitiesAndTimeSpent: "23 Activities (26:35)",
        postDiagnosticCompleted: "10 of 30 Students",
        overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+30%</button>,
      }
    ]
  },
  {
    id: 1668,
    name: "Intermediate Baseline Diagnostic (Pre)",
    preDiagnosticCompleted: '40 of 55 Students',
    studentsCompletedPractice: "32 Students",
    averageActivitiesAndTimeSpent: "10 Activities (16:35)",
    postDiagnosticCompleted: "25 of 55 Students",
    overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+50%</button>,
    aggregate_rows: [
      {
        id: 7,
        name: "Grade 3",
        preDiagnosticCompleted: '15 of 20 Students',
        studentsCompletedPractice: "21 Students",
        averageActivitiesAndTimeSpent: "3 Activities (16:35)",
        postDiagnosticCompleted: "17 of 35 Students",
        overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+25%</button>,
      },
      {
        id: 9,
        name: "Grade 4",
        preDiagnosticCompleted: '20 of 35 Students',
        studentsCompletedPractice: "11 Students",
        averageActivitiesAndTimeSpent: "7 Activities (16:35)",
        postDiagnosticCompleted: "10 of 30 Students",
        overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={jest.fn()}>+75%</button>,
      }
    ]
  }
]

describe('OverviewSection', () => {
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
      const { asFragment } = render(<OverviewSection {...props} />);

      expect(asFragment()).toMatchSnapshot();

      const loadingSpinner = screen.getByRole('img')

      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })

  describe('loaded state', () => {
    test('it should render the expected header components and empty state message', () => {
      props.passedData = []
      const { asFragment } = render(<OverviewSection {...props} />);

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('columnheader', { name: /diagnostic name/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /pre diagnostic completed/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /completed activities/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /average activities & time spent/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /post diagnostic completed/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /overall skill growth/i })).toBeInTheDocument()

      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
    test('it should render the expected data when data is present', () => {
      props.passedData = mockData
      const { asFragment } = render(<OverviewSection {...props} />);

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('cell', { name: /starter baseline diagnostic \(pre\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /57 of 65 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /58 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /17 activities \(26:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /27 of 65 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+20%/i})).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /intermediate baseline diagnostic \(pre\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /40 of 55 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /32 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /10 activities \(16:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /25 of 55 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+50%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /grade 7/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /27 of 35 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /50 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /12 activities \(26:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /17 of 35 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+10%/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 9/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /30 of 30 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /9 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /23 activities \(26:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /10 of 30 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+30%/i })).toBeInTheDocument()
    })
    test('clicking toggle button should expand aggregate rows for diagnostic', async () => {
      props.passedData = mockData
      const { asFragment } = render(<OverviewSection {...props} />);
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /show aggregate row data for intermediate baseline diagnostic \(pre\)/i}))

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('cell', { name: /grade 3/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /15 of 20 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /21 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /3 activities \(16:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /17 of 35 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+25%/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 4/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /20 of 35 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /11 Students/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /7 activities \(16:35\)/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /10 of 30 students/i })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /\+75%/i })).toBeInTheDocument()
    })
  })
})
