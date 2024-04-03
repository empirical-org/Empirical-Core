import * as React from 'react'

import { aggregateOverviewData, createAggregateRowData } from '../diagnosticGrowthReports/helpers'

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
  handleGrowthChipClick: jest.fn(),
  handlePreDiagnosticChipClick: jest.fn()
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
      overall_skill_growth: 0.11936507936507935,
      post_students_completed: 51
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      post_average_score: 0.7261904761904762,
      overall_skill_growth: 0.1002217741935484,
      post_students_completed: 4
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  post_average_score: 0.658874458874459,
  overall_skill_growth: 0.11802217741935484,
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
      students_completed_practice: 113
    },
    {
      aggregate_id: "7",
      diagnostic_id: 1663,
      diagnostic_name: "Starter Baseline Diagnostic (Pre)",
      group_by: "grade",
      name: "Grade 7",
      average_practice_activities_count: 11.91304347826087,
      average_time_spent_seconds: 5157.673913043478,
      students_completed_practice: 46
    }
  ],
  diagnostic_id: 1663,
  diagnostic_name: "Starter Baseline Diagnostic (Pre)",
  group_by: "grade",
  name: "ROLLUP",
  average_practice_activities_count: 19.40880503144654,
  average_time_spent_seconds: 10316.245283018869,
  students_completed_practice: 159
}]

const mockCombinedData = [{
  aggregate_rows: [
    {
      averageActivitiesAndTimeSpent: "22 Activities (206:56)",
      id: "5",
      name: "Grade 5",
      overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+12%</button>,
      postDiagnosticCompleted: "51 of 52 Students",
      preDiagnosticCompleted: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handlePreDiagnosticChipClick} value={1663}>125 of 163 Students</button>,
      studentsCompletedPractice: "113 Students"
    },
    {
      averageActivitiesAndTimeSpent: "12 Activities (85:57)",
      id: "7",
      name: "Grade 7",
      overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+10%</button>,
      postDiagnosticCompleted: "4 of 5 Students",
      preDiagnosticCompleted: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handlePreDiagnosticChipClick} value={1663}>53 of 52 Students</button>,
      studentsCompletedPractice: "46 Students"
    }
  ],
  averageActivitiesAndTimeSpent: "19 Activities (171:56)",
  averageActivitiesCount: 19.40880503144654,
  completedPracticeCount: 159,
  id: 1663,
  name: "Starter Baseline Diagnostic (Pre)",
  overallSkillGrowth: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handleGrowthChipClick} value={1663}>+12%</button>,
  overallSkillGrowthSortValue: 0.11802217741935483,
  preDiagnosticCompleted: <button className="interactive-wrapper emphasized-content" onClick={mockArgs.handlePreDiagnosticChipClick} value={1663}>178 of 215 Students</button>,
  postDiagnosticCompleted: "55 of 215 Students",
  postStudentsCompleted: 55,
  preStudentsCompleted: 178,
  studentsCompletedPractice: "159 Students"
}]

const mockAggregateRowsDataForDiagnostic1 = {
  9955813: {
    average_practice_activities_count: 15.058823529411764,
    average_time_spent_seconds: 6991.35294117647,
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "teacher",
    name: "Gabriela Segura",
    order: 14,
    overall_skill_growth: 0.058248299319727886,
    post_students_assigned: 7,
    post_students_completed: 7,
    pre_average_score: 0.5543575920934412,
    pre_students_assigned: 54,
    pre_students_completed: 53,
    students_completed_practice: 51
  },
  9959478: {
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "teacher",
    name: "Mindy Santillan",
    order: 13,
    overall_skill_growth: null,
    post_students_completed: 0,
    pre_average_score: 0.5917366946778712,
    pre_students_assigned: 72,
    pre_students_completed: 68
  },
  9992069: {
    average_practice_activities_count: 12,
    average_time_spent_seconds: 4562.2,
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "teacher",
    name: "Catherine Vazquez",
    order: 17,
    overall_skill_growth: null,
    post_students_completed: 0,
    pre_average_score: 0.5661375661375662,
    pre_students_assigned: 10,
    pre_students_completed: 9,
    students_completed_practice: 5
  }
}

const mockAggregateRowsDataForDiagnostic2 = {
  9955813: {
    average_practice_activities_count: 15.058823529411764,
    average_time_spent_seconds: 6991.35294117647,
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "classroom",
    name: "ELA & ELL - Period 4",
    order: 14,
    overall_skill_growth: 0.058248299319727886,
    post_students_assigned: 7,
    post_students_completed: 7,
    pre_average_score: 0.5543575920934412,
    pre_students_assigned: 54,
    pre_students_completed: 53,
    students_completed_practice: 51
  },
  9959478: {
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "classroom",
    name: "ELA & ELL - Period 2",
    order: 13,
    overall_skill_growth: null,
    post_students_completed: 0,
    pre_average_score: 0.5917366946778712,
    pre_students_assigned: 72,
    pre_students_completed: 68
  },
  9992069: {
    average_practice_activities_count: 12,
    average_time_spent_seconds: 4562.2,
    diagnostic_id: 1663,
    diagnostic_name: "Starter Baseline Diagnostic (Pre)",
    group_by: "classroom",
    name: "6th ELA Period 1 - Year 5",
    order: 12,
    overall_skill_growth: null,
    post_students_completed: 0,
    pre_average_score: 0.5661375661375662,
    pre_students_assigned: 10,
    pre_students_completed: 9,
    students_completed_practice: 5
  }
}

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
describe('#createAggregateRowData', () => {
  describe('by teacher', () => {
    it('returns data sorted alphabetically by name', () => {
      const aggregateRowData = createAggregateRowData({
        aggregateRowsDataForDiagnostic: mockAggregateRowsDataForDiagnostic1,
        diagnosticId: 1664,
        handleGrowthChipClick: jest.fn,
        handlePreDiagnosticChipClick: jest.fn,
        groupByValue: 'teacher'
      })
      expect(aggregateRowData[0].name).toEqual('Mindy Santillan')
      expect(aggregateRowData[1].name).toEqual('Gabriela Segura')
      expect(aggregateRowData[2].name).toEqual('Catherine Vazquez')
    })
  })
  describe('by classroom', () => {
    it('returns data sorted alphabetically by name', () => {
      const aggregateRowData = createAggregateRowData({
        aggregateRowsDataForDiagnostic: mockAggregateRowsDataForDiagnostic2,
        diagnosticId: 1664,
        handleGrowthChipClick: jest.fn,
        handlePreDiagnosticChipClick: jest.fn,
        groupByValue: 'classroom'
      })
      expect(aggregateRowData[0].name).toEqual('6th ELA Period 1 - Year 5')
      expect(aggregateRowData[1].name).toEqual('ELA & ELL - Period 2')
      expect(aggregateRowData[2].name).toEqual('ELA & ELL - Period 4')
    })
  })
})
