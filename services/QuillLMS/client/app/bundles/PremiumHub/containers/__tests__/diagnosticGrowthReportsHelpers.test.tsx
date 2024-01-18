import * as React from 'react'

import { aggregateOverviewData } from '../diagnosticGrowthReports/helpers'

const mockArgs = {
  preDiagnosticAssignedData: [],
  postDiagnosticAssignedData: [],
  preDiagnosticCompletedData: [],
  postDiagnosticCompletedData: [],
  recommendationsData: [],
  setAggregatedData: jest.fn(),
  handleSetNoDiagnosticDataAvailable: jest.fn(),
  hasAdjustedFiltersFromDefault: false,
  setLoading: jest.fn(),
  handleGrowthChipClick: jest.fn()
}

const mockPreDiagnosticAssignedData = [{
  aggregate_id: null,
  aggregate_rows: [
    {
      aggregate_id: "5",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 5",
      pre_students_assigned: 163
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      pre_students_assigned: 52
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  pre_students_assigned: 215
}]

const mockPostDiagnosticAssignedData = [{
  aggregate_id: null,
  aggregate_rows: [
    {
      aggregate_id: "5",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 5",
      post_students_assigned: 52
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      post_students_assigned: 5
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  post_students_assigned: 215
}]

const mockPreDiagnosticCompletedData = [{
  aggregate_id: null,
  aggregate_rows: [
    {
      aggregate_id: "5",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 5",
      pre_average_score: 0.36228571428571427,
      pre_students_completed: 125
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      pre_average_score: 0.5363881401617251,
      pre_students_completed: 53
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  pre_average_score: 0.4141252006420546,
  pre_students_completed: 178
}]

const mockPostDiagnosticCompletedData = [{
  aggregate_id: null,
  aggregate_rows: [
    {
      aggregate_id: "5",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 5",
      post_average_score: 0.6535947712418301,
      post_students_completed: 51
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      post_average_score: 0.7261904761904762,
      post_students_completed: 4
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  post_average_score: 0.658874458874459,
  post_students_completed: 55
}]

const mockRecommendationsData = [{
  aggregate_id: null,
  aggregate_rows: [
    {
      aggregate_id: "5",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 5",
      average_practice_activities_count: 22.460176991150444,
      average_time_spent_seconds: 12416.194690265487,
      students_completed_practice: 113,
      students_completed_weight: 114
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      average_practice_activities_count: 11.91304347826087,
      average_time_spent_seconds: 5157.673913043478,
      students_completed_practice: 46,
      students_completed_weight: 47
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  average_practice_activities_count: 19.40880503144654,
  average_time_spent_seconds: 10316.245283018869,
  students_completed_practice: 159,
  students_completed_weight: 161
}]

const mockCombinedData = [{
  aggregate_rows: [
    {
      averageActivitiesAndTimeSpent: "22 Activities (26:56)",
      id: "5",
      name: "Grade 5",
      overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+29%</button>,
      postDiagnosticCompleted: "51 of 52 Students",
      preDiagnosticCompleted: <p className="emphasized-content">125 of 163 Students</p>,
      studentsCompletedPractice: "114 Students"
    },
    {
      averageActivitiesAndTimeSpent: "12 Activities (25:57)",
      id: "7",
      name: "Grade 7",
      overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+19%</button>,
      postDiagnosticCompleted: "4 of 5 Students",
      preDiagnosticCompleted: <p className="emphasized-content">53 of 52 Students</p>,
      studentsCompletedPractice: "47 Students"
    }
  ],
  averageActivitiesAndTimeSpent: "19 Activities (51:56)",
  id: 1663,
  name: "Starter Baseline Diagnostic (Pre)",
  overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+24%</button>,
  preDiagnosticCompleted: <p className="emphasized-content">178 of 215 Students</p>,
  postDiagnosticCompleted: "55 of 215 Students",
  studentsCompletedPractice: "161 Students"
}]

describe('#aggregateOverviewData', () => {
  describe('there is no preDiagnosticAssignedData', () => {
    it('calls handleSetNoDiagnosticDataAvailable with true and setLoading with false', () => {
      aggregateOverviewData(mockArgs)
      expect(mockArgs.handleSetNoDiagnosticDataAvailable).toHaveBeenCalledWith(true)
      expect(mockArgs.setLoading).toHaveBeenCalledWith(false)
    })
  })
  describe('there is processable data', () => {
    it('calls setAggregatedData with the expected data object', () => {
      mockArgs.preDiagnosticAssignedData = mockPreDiagnosticAssignedData
      mockArgs.preDiagnosticCompletedData = mockPreDiagnosticCompletedData
      mockArgs.postDiagnosticAssignedData = mockPostDiagnosticAssignedData
      mockArgs.postDiagnosticCompletedData = mockPostDiagnosticCompletedData
      mockArgs.recommendationsData = mockRecommendationsData
      aggregateOverviewData(mockArgs)
      expect(mockArgs.setLoading).toHaveBeenCalledWith(false)
      expect(mockArgs.setAggregatedData).toHaveBeenCalledWith(mockCombinedData)
    })
  })
})
