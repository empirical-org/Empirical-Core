import * as React from 'react'

import { aggregateOverviewData, growthResultsValue, noDataToShow } from '../diagnosticGrowthReports/helpers'
import { Tooltip } from '../../../Shared'

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

describe('#growthResultsValue', () => {
  it('returns growth score value with student count if growth score present', () => {
    const value = growthResultsValue({ growthScore: 0.6428571428571429, studentCount: 5, preScoreCompletedPost: 0.2857142857142857, postStudentsCompleted: 3, postScore: 0.9285714285714286 })
    expect(value).toEqual('+64% (5)')
  })
  it('returns no class growth with tooltip if growthScore is 0 and preScoreCompletedPost and postStudentsCompleted values are present', () => {
    const value = growthResultsValue({ growthScore: 0, studentCount: 5, preScoreCompletedPost: 0.7857142857142857, postStudentsCompleted: 3, postScore: 0.6285714285714286 })
    expect(value).toEqual(
      <div className="no-class-growth">
        <p>No class growth</p>
        <Tooltip isTabbable={true} tooltipText="The Pre Score of the 3 students that completed the Post Diagnostic was 79%. As the Post Score of these students (63%) was lower than this, we deem there to have been no overall class growth." tooltipTriggerText={<img alt="Question mark icon" src="undefined/images/icons/icons-help.svg" />} />
      </div>
    )
  })
  it('returns -- value for all other cases', () => {
    const value = growthResultsValue({ growthScore: 0, studentCount: 5, preScoreCompletedPost: 0, postStudentsCompleted: 3, postScore: 0.9285714285714286 })
    expect(value).toEqual(noDataToShow)
  })
})
