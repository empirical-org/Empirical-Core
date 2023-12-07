import * as React from 'react'
import { getTimeInMinutesAndSeconds } from "../../shared"

const noDataToShow = '--'

export const diagnosticNameTooltipText = "This report shows all of the diagnostics that have been assigned by teachers connected to your account.<br/><br/>  Each diagnostic offering includes a Pre assessment of each student's writing skills, around 40 practice activities recommended by the diagnostic based on the Pre performance, and a Post diagnostic to measure growth after the practice activities are completed.<br/><br/> Diagnostic will not be displayed in this report until at least one teacher has assigned it within the filters you have selected."
export const preDiagnosticCompletedTooltipText = "The total number of students who completed the Pre diagnostic of all of the students assigned the Pre diagnostic."
export const completedActivitiesTooltipText = "The total number of students who have completed the practice activities linked to this diagnostic.<br/><br/> A student is counted once the student has completed at least one practice activity linked to this diagnostic."
export const averageActivitiesAndTimeSpentTooltipText = "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities and the average time spent per student.<br/><br/> This counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."
export const postDiagnosticCompletedTooltipText = "The total number of students who completed the Post diagnostic of all of the students assigned the Post diagnostic.<br/><br/> Students are not included in this count until their teacher assigns the Post diagnostic to them."
export const overallSkillGrowthTooltipText = "The average increase in growth scores across all of the skills.<br/><br/> The Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills."

export function aggregateOverviewData({
  preDiagnosticAssignedData,
  postDiagnosticAssignedData,
  preDiagnosticCompletedData,
  postDiagnosticCompletedData,
  recommendationsData,
  setAggregatedData,
  handleSetNoDiagnosticDataAvailable,
  hasAdjustedFiltersFromDefault,
  setLoading,
  handleGrowthChipClick
}) {

  if ((!preDiagnosticAssignedData.length && !postDiagnosticAssignedData.length && !preDiagnosticCompletedData.length && !postDiagnosticCompletedData.length && !recommendationsData.length) && !hasAdjustedFiltersFromDefault) {
    handleSetNoDiagnosticDataAvailable(true)
    setLoading(false)
    return
  }

  const preDiagnosticAssignedDataHash = {}
  const postDiagnosticAssignedDataHash = {}
  const preDiagnosticCompletedDataHash = {}
  const postDiagnosticCompletedDataHash = {}
  const recommendationsDataHash = {}
  const aggregateRowsData = {}

  const combinedData = preDiagnosticAssignedData.map(entry => {
    const { diagnostic_id, diagnostic_name, aggregate_rows, pre_students_assigned } = entry
    preDiagnosticAssignedDataHash[diagnostic_id] = { pre_students_assigned }
    aggregateRowsData[diagnostic_id] = {}
    aggregate_rows.map(row => {
      const { aggregate_id, pre_students_assigned, name } = row
      aggregateRowsData[diagnostic_id][aggregate_id] = { name, pre_students_assigned }
    })
    return {
      id: diagnostic_id,
      name: diagnostic_name,
      preDiagnosticCompleted: null,
      studentsCompletedPractice: null,
      averageActivitiesAndTimeSpent: null,
      postDiagnosticCompleted: null,
      overallSkillGrowth: null,
      aggregate_rows: null
    }
  })

  postDiagnosticAssignedData.map(entry => {
    const { diagnostic_id, aggregate_rows, post_students_assigned } = entry
    postDiagnosticAssignedDataHash[diagnostic_id] = { post_students_assigned }
    aggregate_rows.map(row => {
      const { aggregate_id, post_students_assigned } = row
      if (aggregateRowsData[diagnostic_id] && aggregateRowsData[diagnostic_id][aggregate_id]) {
        aggregateRowsData[diagnostic_id][aggregate_id] = { ...aggregateRowsData[diagnostic_id][aggregate_id], post_students_assigned }
      }
    })
  })
  preDiagnosticCompletedData.map(entry => {
    const { diagnostic_id, aggregate_rows, pre_average_score, pre_students_completed } = entry
    preDiagnosticCompletedDataHash[diagnostic_id] = {
      pre_average_score,
      pre_students_completed
    }
    aggregate_rows.map(row => {
      const { aggregate_id, pre_average_score, pre_students_completed } = row
      if (aggregateRowsData[diagnostic_id] && aggregateRowsData[diagnostic_id][aggregate_id]) {
        aggregateRowsData[diagnostic_id][aggregate_id] = { ...aggregateRowsData[diagnostic_id][aggregate_id], pre_average_score, pre_students_completed }
      }
    })
  })
  postDiagnosticCompletedData.map(entry => {
    const { diagnostic_id, aggregate_rows, post_average_score, post_students_completed } = entry
    postDiagnosticCompletedDataHash[diagnostic_id] = {
      post_average_score,
      post_students_completed
    }
    aggregate_rows.map(row => {
      const { aggregate_id, post_average_score, post_students_completed } = row
      if (aggregateRowsData[diagnostic_id] && aggregateRowsData[diagnostic_id][aggregate_id]) {
        aggregateRowsData[diagnostic_id][aggregate_id] = { ...aggregateRowsData[diagnostic_id][aggregate_id], post_average_score, post_students_completed }
      }
    })
  })
  recommendationsData.map(entry => {
    const { diagnostic_id, aggregate_rows, average_practice_activities_count, average_time_spent_seconds, students_completed_practice } = entry
    recommendationsDataHash[diagnostic_id] = {
      average_practice_activities_count,
      average_time_spent_seconds,
      students_completed_practice
    }
    aggregate_rows.map(row => {
      const { aggregate_id, average_practice_activities_count, average_time_spent_seconds, students_completed_practice } = row
      if (aggregateRowsData[diagnostic_id] && aggregateRowsData[diagnostic_id][aggregate_id]) {
        aggregateRowsData[diagnostic_id][aggregate_id] = { ...aggregateRowsData[diagnostic_id][aggregate_id], average_practice_activities_count, average_time_spent_seconds, students_completed_practice }
      }
    })
  })

  combinedData.forEach(entry => {
    const { id } = entry
    if (!preDiagnosticAssignedDataHash[id]?.pre_students_assigned) { return }
    const preStudentsAssigned = preDiagnosticAssignedDataHash[id]?.pre_students_assigned
    const preStudentsCompleted = preDiagnosticCompletedDataHash[id]?.pre_students_completed
    const preDiagnosticScore = preDiagnosticCompletedDataHash[id]?.pre_average_score
    const postStudentsAssigned = postDiagnosticAssignedDataHash[id]?.post_students_assigned
    const postStudentsCompleted = postDiagnosticCompletedDataHash[id]?.post_students_completed
    const postDiagnosticScore = postDiagnosticCompletedDataHash[id]?.post_average_score
    const studentsCompletedPractice = recommendationsDataHash[id]?.students_completed_practice
    const averageActivitiesCount = recommendationsDataHash[id]?.average_practice_activities_count
    const averageTimespent = recommendationsDataHash[id]?.average_time_spent_seconds
    const aggregateRowsDataForDiagnostic = aggregateRowsData[id]
    let overallSkillGrowth: string | JSX.Element = 'No Growth'
    if (!preDiagnosticScore || !postDiagnosticScore) {
      overallSkillGrowth = noDataToShow
    } else if (preDiagnosticScore && postDiagnosticScore && postDiagnosticScore > preDiagnosticScore) {
      overallSkillGrowth = <button className="interactive-wrapper emphasized-content" onClick={handleGrowthChipClick} value={id}>{`+${Math.round((postDiagnosticScore * 100) - (preDiagnosticScore * 100))}%`}</button>
    }
    entry.preDiagnosticCompleted = preStudentsAssigned ? <p className="emphasized-content">{`${preStudentsCompleted || 0} of ${preStudentsAssigned} Students`}</p> : noDataToShow
    entry.studentsCompletedPractice = studentsCompletedPractice ? `${studentsCompletedPractice} Students` : noDataToShow
    entry.averageActivitiesAndTimeSpent = averageActivitiesCount ? `${Math.round(averageActivitiesCount) || 0} Activities (${getTimeInMinutesAndSeconds(averageTimespent)})` : noDataToShow
    entry.postDiagnosticCompleted = postStudentsAssigned ? `${postStudentsCompleted || 0} of ${postStudentsAssigned} Students` : noDataToShow
    entry.overallSkillGrowth = overallSkillGrowth
    const aggregateRows = Object.keys(aggregateRowsDataForDiagnostic).map(key => {
      const { name, post_average_score, post_students_assigned, post_students_completed, pre_average_score, pre_students_assigned, pre_students_completed, students_completed_practice, average_practice_activities_count, average_time_spent_seconds } = aggregateRowsDataForDiagnostic[key]
      let overallSkillGrowth: string | JSX.Element = 'No Growth'

      if(!name) { return null }
      if(!pre_average_score  || !post_average_score) {
        overallSkillGrowth = noDataToShow
      } else if (pre_average_score && post_average_score && post_average_score > pre_average_score) {
        overallSkillGrowth = <button className="interactive-wrapper emphasized-content" onClick={handleGrowthChipClick} value={id}>{`+${Math.round((post_average_score * 100) - (pre_average_score * 100))}%`}</button>
      }
      return {
        id: key,
        name,
        preDiagnosticCompleted: pre_students_assigned ? <p className="emphasized-content">{`${pre_students_completed || 0} of ${pre_students_assigned} Students`}</p> : noDataToShow,
        studentsCompletedPractice: students_completed_practice ? `${students_completed_practice} Students` : noDataToShow,
        averageActivitiesAndTimeSpent: average_practice_activities_count ? `${Math.round(average_practice_activities_count) || 0} Activities (${getTimeInMinutesAndSeconds(average_time_spent_seconds)})` : noDataToShow,
        postDiagnosticCompleted: post_students_assigned ? `${post_students_completed || 0} of ${post_students_assigned} Students` : noDataToShow,
        overallSkillGrowth
      }
    })
    entry.aggregate_rows = aggregateRows.filter(row => !!row)
  })
  setAggregatedData(combinedData)
  setLoading(false)
}

export function aggregateSkillsData({
  skillsData,
  setAggregatedData,
  hasAdjustedFiltersFromDefault,
  handleSetNoDiagnosticDataAvailable,
  setLoading
}) {
  if (!skillsData.length && !hasAdjustedFiltersFromDefault) {
    handleSetNoDiagnosticDataAvailable(true)
    setLoading(false)
    return
  }
  console.log("🚀 ~ file: helpers.tsx:168 ~ skillsData:", skillsData)
  return skillsData.map(entry => {
    const { aggregate_rows, improved_proficiency, maintained_proficiency, post_correct_total, post_score, post_total_questions, pre_correct_total, pre_score, pre_total_questions, recommended_practice, skill_name } = entry
    return {

    }
  })
}
