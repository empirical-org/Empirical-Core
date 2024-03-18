import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import * as requestsApi from '../../../../modules/request';
import StudentSection from "../diagnosticGrowthReports/studentSection";
import { aggregateStudentData } from "../diagnosticGrowthReports/helpers";

const props = {
  searchCount: 0,
  selectedGrades: [],
  selectedSchoolIds: [],
  selectedTeacherIds: [],
  selectedClassroomIds: [],
  selectedTimeframe: "This school year",
  pusherChannel: null,
  handleSetDiagnosticIdForStudentCount: jest.fn(),
  passedStudentData: null,
  passedRecommendationsData: null,
  passedVisibleData: null
}

const mockStudentData = [
  {
    aggregate_id: null,
    classroom_id: 1446858,
    group_by: "student",
    name: "ROLLUP",
    post_activity_session_completed_at: "2023-10-31T16:28:28.423+00:00",
    post_questions_correct: 11,
    post_questions_percentage: 0.5340136054421769,
    post_questions_total: 21,
    post_skills_improved: 3,
    post_skills_improved_or_maintained: 4,
    post_skills_maintained: 1,
    post_skills_to_practice: 3,
    pre_activity_session_completed_at: "2023-08-23T16:24:49.386+00:00",
    pre_questions_correct: 6,
    pre_questions_percentage: 0.380952380952381,
    pre_questions_total: 21,
    pre_skills_proficient: 1,
    pre_skills_to_practice: 6,
    pre_to_post_improved_skill_count: 3,
    skill_group_name: "ROLLUP",
    student_id: 2,
    student_name: "Student B",
    total_skills: 7,
    aggregate_rows: [],
  },
  {
    aggregate_id: null,
    classroom_id: 1465820,
    group_by: "student",
    name: "ROLLUP",
    post_activity_session_completed_at: null,
    post_questions_correct: null,
    post_questions_percentage: null,
    post_questions_total: null,
    post_skills_improved: 0,
    post_skills_improved_or_maintained: 0,
    post_skills_maintained: 0,
    post_skills_to_practice: 0,
    pre_activity_session_completed_at: "2023-08-25T21:25:23.932+00:00",
    pre_questions_correct: 14,
    pre_questions_percentage: 0.7755102040816325,
    pre_questions_total: 21,
    pre_skills_proficient: 4,
    pre_skills_to_practice: 3,
    pre_to_post_improved_skill_count: 0,
    skill_group_name: "ROLLUP",
    student_id: 1,
    student_name: "Student A",
    total_skills: 7,
    aggregate_rows: [
      {
        aggregate_id: "1465820:1",
        classroom_id: 1465820,
        group_by: "student",
        name: "ROLLUP",
        post_activity_session_completed_at: null,
        post_questions_correct: null,
        post_questions_percentage: null,
        post_questions_total: null,
        post_skills_improved: 0,
        post_skills_improved_or_maintained: 0,
        post_skills_maintained: 0,
        post_skills_to_practice: 0,
        pre_activity_session_completed_at: "2023-08-25T21:25:23.932+00:00",
        pre_questions_correct: 3,
        pre_questions_percentage: 0.42857142857142855,
        pre_questions_total: 7,
        pre_skills_proficient: 1,
        pre_skills_to_practice: 0,
        pre_to_post_improved_skill_count: 1,
        student_id: 1,
        student_name: "Student A",
        skill_group_name: "Adjectives and Adverbs",
        total_skills: 7
      },
      {
        aggregate_id: "1465820:1",
        classroom_id: 1465820,
        group_by: "student",
        name: "ROLLUP",
        post_activity_session_completed_at: null,
        post_questions_correct: null,
        post_questions_percentage: null,
        post_questions_total: null,
        post_skills_improved: 0,
        post_skills_improved_or_maintained: 0,
        post_skills_maintained: 0,
        post_skills_to_practice: 0,
        pre_activity_session_completed_at: "2023-08-25T21:25:23.932+00:00",
        pre_questions_correct: 2,
        pre_questions_percentage: 1,
        pre_questions_total: 2,
        pre_skills_proficient: 1,
        pre_skills_to_practice: 0,
        pre_to_post_improved_skill_count: 1,
        student_id: 1,
        student_name: "Student A",
        skill_group_name: "Capitalization",
        total_skills: 7
      }
    ],
  },
]

const mockRecommendationsData = {
  "2": {
    completed_activities: 40,
    time_spent_seconds: 18033
  }
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
      props.passedStudentData = []
      props.passedRecommendationsData = []
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
      props.passedStudentData = []
      props.passedRecommendationsData = []
      props.passedVisibleData = []
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
    test('it should render the expected data when data is present', () => {
      props.passedStudentData = mockStudentData
      props.passedRecommendationsData = mockRecommendationsData
      props.passedVisibleData = aggregateStudentData(mockStudentData, mockRecommendationsData)
      const { asFragment } = render(<StudentSection {...props} />);
      expect(asFragment()).toMatchSnapshot();
      const row1 = screen.getByRole('row', { name: /student a — 14 of 21 questions \(67%\) 4 of 7 skills \(3 skills to practice\) — — —/i });
      const row2 = screen.getByRole('row', { name: /student b \+3 improved skills 6 of 21 questions \(29%\) 1 of 7 skills \(6 skills to practice\) 40 \(5 hrs\) 11 of 21 questions \(52%\) 4 of 7 skills \(3 improved, 1 maintained\)/i });
      expect(row1).toBeTruthy()
      expect(row2).toBeTruthy()
    })
    test('clicking toggle button should expand aggregate rows for skill', async () => {
      props.passedStudentData = mockStudentData
      props.passedRecommendationsData = mockRecommendationsData
      props.passedVisibleData = aggregateStudentData(mockStudentData, mockRecommendationsData)
      const { asFragment } = render(<StudentSection {...props} />);
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /show aggregate row data for student a/i }))
      expect(asFragment()).toMatchSnapshot();
      const row1 = screen.getByRole('row', { name: /adjectives and adverbs 3 of 7 questions \(43%\) revise icon skill to practice — —/i});
      const row2 = screen.getByRole('row', { name: /capitalization 2 of 2 questions \(100%\) green circle with dark green checkmark skill proficient — —/i });
      expect(row1).toBeTruthy()
      expect(row2).toBeTruthy()
    })
  })
})
