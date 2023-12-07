import * as React from 'react'
import { getTimeInMinutesAndSeconds } from "../../shared"

export const diagnosticNameTooltipText = "This report shows all of the diagnostics that have been assigned by teachers connected to your account.<br/><br/>  Each diagnostic offering includes a Pre assessment of each student's writing skills, around 40 practice activities recommended by the diagnostic based on the Pre performance, and a Post diagnostic to measure growth after the practice activities are completed.<br/><br/> Diagnostic will not be displayed in this report until at least one teacher has assigned it within the filters you have selected."
export const preDiagnosticCompletedTooltipText = "The total number of students who completed the Pre diagnostic of all of the students assigned the Pre diagnostic."
export const completedActivitiesTooltipText = "The total number of students who have completed the practice activities linked to this diagnostic.<br/><br/> A student is counted once the student has completed at least one practice activity linked to this diagnostic."
export const averageActivitiesAndTimeSpentTooltipText = "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities and the average time spent per student.<br/><br/> This counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."
export const postDiagnosticCompletedTooltipText = "The total number of students who completed the Post diagnostic of all of the students assigned the Post diagnostic.<br/><br/> Students are not included in this count until their teacher assigns the Post diagnostic to them."
export const overallSkillGrowthTooltipText = "The average increase in growth scores across all of the skills.<br/><br/> The Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills."

const noDataToShow = '--'

function processAggregateRows(aggregateRowsData, diagnosticId, rowData) {
  // set initial empty value if first pass
  if (!aggregateRowsData[diagnosticId]) {
    aggregateRowsData[diagnosticId] = {}
  }
  rowData.map(row => {
    const { aggregate_id, ...properties } = row;
    if(aggregateRowsData[diagnosticId] && !aggregateRowsData[diagnosticId][aggregate_id]) {
      aggregateRowsData[diagnosticId][aggregate_id] = {...properties}
    }
    if (aggregateRowsData[diagnosticId] && aggregateRowsData[diagnosticId][aggregate_id]) {
      aggregateRowsData[diagnosticId][aggregate_id] = { ...aggregateRowsData[diagnosticId][aggregate_id], ...properties };
    }
  });
}

function preDiagnosticCompletedValue(preStudentsAssigned, preStudentsCompleted) {
  return preStudentsAssigned ? <p className="emphasized-content">{`${preStudentsCompleted || 0} of ${preStudentsAssigned} Students`}</p> : noDataToShow
}

function studentsCompletedPracticeValue(studentsCompletedPractice) {
  return studentsCompletedPractice ? `${studentsCompletedPractice} Students` : noDataToShow
}

function averageActivitiesAndTimeSpentValue(averageActivitiesCount, averageTimespent) {
  return averageActivitiesCount ? `${Math.round(averageActivitiesCount) || 0} Activities (${getTimeInMinutesAndSeconds(averageTimespent)})` : noDataToShow
}

function postDiagnosticCompleted(postStudentsAssigned, postStudentsCompleted) {
  return postStudentsAssigned ? `${postStudentsCompleted || 0} of ${postStudentsAssigned} Students` : noDataToShow
}

function overallSkillGrowthValue(preScore, postScore) {
  if (!postScore) {
    return noDataToShow;
  } else if (preScore && postScore && postScore > preScore) {
    return <p className="emphasized-content">{`+${Math.round((postScore * 100) - (preScore * 100))}%`}</p>;
  }
  return 'No Growth';
}

function createAggregateRowData(aggregateRowsDataForDiagnostic) {
  return Object.keys(aggregateRowsDataForDiagnostic).map(key => {
    const data = aggregateRowsDataForDiagnostic[key];
    // we can early return if there are no students assigned to pre diagnostic
    if (!data.pre_students_assigned) { return null }
    const overallSkillGrowth = overallSkillGrowthValue(data.pre_average_score, data.post_average_score);

    return {
      id: key,
      name: data.name,
      preDiagnosticCompleted: preDiagnosticCompletedValue(data.pre_students_assigned, data.pre_students_completed),
      studentsCompletedPractice: studentsCompletedPracticeValue(data.students_completed_practice),
      averageActivitiesAndTimeSpent: averageActivitiesAndTimeSpentValue(data.average_practice_activities_count, data.average_time_spent_seconds),
      postDiagnosticCompleted: postDiagnosticCompleted(data.post_students_assigned, data.post_students_completed),
      overallSkillGrowth
    };
  }).filter(row => !!row);
}

export function aggregateOverviewData(args) {
  const { preDiagnosticAssignedData, postDiagnosticAssignedData, preDiagnosticCompletedData, postDiagnosticCompletedData, recommendationsData, setAggregatedData, handleSetNoDiagnosticDataAvailable, hasAdjustedFiltersFromDefault, setLoading } = args;

  // if there are no results for the pre diagnostic API and filters are at default, no diagnostics have been assigned
  if (!preDiagnosticAssignedData.length && !hasAdjustedFiltersFromDefault) {
    handleSetNoDiagnosticDataAvailable(true);
    setLoading(false);
    return;
  }

  // Hash tables for data storage of each individual API results plus storing the aggregate row data for each diagnostic
  const preDiagnosticAssignedDataHash = {};
  const postDiagnosticAssignedDataHash = {};
  const preDiagnosticCompletedDataHash = {};
  const postDiagnosticCompletedDataHash = {};
  const recommendationsDataHash = {};
  const aggregateRowsData = {};

  // on first pass, we build the object needed for each row for the data table and populate with the necessary pre-diagnostic-assigned API results data
  const combinedData = preDiagnosticAssignedData.map(entry => {
    const { diagnostic_id, diagnostic_name, aggregate_rows, pre_students_assigned } = entry
    preDiagnosticAssignedDataHash[diagnostic_id] = { pre_students_assigned }
    processAggregateRows(aggregateRowsData, diagnostic_id, aggregate_rows)
    return {
      id: diagnostic_id,
      name: diagnostic_name,
      preDiagnosticCompleted: null,
      studentsCompletedPractice: null,
      averageActivitiesAndTimeSpent: null,
      postDiagnosticCompleted: null,
      overallSkillGrowth: null,
      aggregate_rows: null
    };
  });

  // process data for post-diagnostic-assigned API results
  postDiagnosticAssignedData.map(entry => {
    const { diagnostic_id, aggregate_rows, post_students_assigned } = entry
    postDiagnosticAssignedDataHash[diagnostic_id] = { post_students_assigned }
    processAggregateRows(aggregateRowsData, diagnostic_id, aggregate_rows)
  })

  // process data for pre-diagnostic-completed API results
  preDiagnosticCompletedData.map(entry => {
    const { diagnostic_id, aggregate_rows, pre_average_score, pre_students_completed } = entry
    preDiagnosticCompletedDataHash[diagnostic_id] = {
      pre_average_score,
      pre_students_completed
    }
    processAggregateRows(aggregateRowsData, diagnostic_id, aggregate_rows)
  })

  // process data for post-diagnostic-completed API results
  postDiagnosticCompletedData.map(entry => {
    const { diagnostic_id, aggregate_rows, post_average_score, post_students_completed } = entry
    postDiagnosticCompletedDataHash[diagnostic_id] = {
      post_average_score,
      post_students_completed
    }
    processAggregateRows(aggregateRowsData, diagnostic_id, aggregate_rows)
  })

  // process data for recommendations API results
  recommendationsData.map(entry => {
    const { diagnostic_id, aggregate_rows, average_practice_activities_count, average_time_spent_seconds, students_completed_practice } = entry
    recommendationsDataHash[diagnostic_id] = {
      average_practice_activities_count,
      average_time_spent_seconds,
      students_completed_practice
    }
    processAggregateRows(aggregateRowsData, diagnostic_id, aggregate_rows)
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
    entry.preDiagnosticCompleted = preDiagnosticCompletedValue(preStudentsAssigned, preStudentsCompleted)
    entry.studentsCompletedPractice = studentsCompletedPracticeValue(studentsCompletedPractice)
    entry.averageActivitiesAndTimeSpent = averageActivitiesAndTimeSpentValue(averageActivitiesCount, averageTimespent)
    entry.postDiagnosticCompleted = postDiagnosticCompleted(postStudentsAssigned, postStudentsCompleted)
    entry.overallSkillGrowth = overallSkillGrowthValue(preDiagnosticScore, postDiagnosticScore)
    entry.aggregate_rows = createAggregateRowData(aggregateRowsDataForDiagnostic)
  })
  setAggregatedData(combinedData);
  setLoading(false);
}
