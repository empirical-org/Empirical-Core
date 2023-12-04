import * as React from 'react'
import { getTimeInMinutesAndSeconds } from "../../shared"

const noDataToShow = '--'

export function aggregateOverviewData({
  preDiagnosticAssignedData,
  postDiagnosticAssignedData,
  preDiagnosticCompletedData,
  postDiagnosticCompletedData,
  recommendationsData,
  setAggregatedData,
  setLoading
}) {
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
    if (preDiagnosticScore && !postDiagnosticScore) {
      overallSkillGrowth = noDataToShow
    } else if (preDiagnosticScore && postDiagnosticScore && postDiagnosticScore > preDiagnosticScore) {
      overallSkillGrowth = <p className="emphasized-content">{`+${Math.round((postDiagnosticScore * 100) - (preDiagnosticScore * 100))}%`}</p>
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
      if(pre_average_score  && !post_average_score) {
        overallSkillGrowth = noDataToShow
      } else if (pre_average_score && post_average_score && post_average_score > pre_average_score) {
        overallSkillGrowth = <p className="emphasized-content">{`+${Math.round((post_average_score * 100) - (pre_average_score * 100))}%`}</p>
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
