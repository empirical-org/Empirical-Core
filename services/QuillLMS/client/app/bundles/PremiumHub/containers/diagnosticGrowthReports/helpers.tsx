import * as React from 'react'
import { getTimeInMinutesAndSeconds } from "../../shared"

// Overview tooltips
export const diagnosticNameTooltipText = "This report shows all of the diagnostics that have been assigned by teachers connected to your account.<br/><br/>  Each diagnostic offering includes a Pre assessment of each student's writing skills, around 40 practice activities recommended by the diagnostic based on the Pre performance, and a Post diagnostic to measure growth after the practice activities are completed.<br/><br/> Diagnostic will not be displayed in this report until at least one teacher has assigned it within the filters you have selected."
export const preDiagnosticCompletedTooltipText = "The total number of students who completed the Pre diagnostic of all of the students assigned the Pre diagnostic."
export const completedActivitiesTooltipText = "The total number of students who have completed the practice activities linked to this diagnostic.<br/><br/> A student is counted once the student has completed at least one practice activity linked to this diagnostic."
export const averageActivitiesAndTimeSpentTooltipText = "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities and the average time spent per student.<br/><br/> This counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."
export const postDiagnosticCompletedTooltipText = "The total number of students who completed the Post diagnostic of all of the students assigned the Post diagnostic.<br/><br/> Students are not included in this count until their teacher assigns the Post diagnostic to them."
export const overallSkillGrowthTooltipText = "The average increase in growth scores across all of the skills.<br/><br/> The Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills.<br/><br/>The growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre."

// Skills tooltips
export const preSkillScoreTooltipText = "The averaged number of questions answered correctly for this skill on the Pre diagnostic.<br/><br/> This is the average score for all of the students selected in the filters."
export const postSkillScoreTooltipText = "The averaged number of questions answered correctly for this skill on the Post diagnostic.<br/><br/> This is the average score for all of the students selected in the filters."
export const growthResultsTooltipText = "The increase in the averaged number of questions answered correctly for this skill from the Pre to the Post diagnostic.<br/><br/> This is the average increase for all of the students selected in the filters.<br/><br/>The growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre."
export const studentsImprovedSkillTooltipText = 'The number of students who improved in the skill by answering more questions correctly on the Post diagnostic than they did on the Pre. This includes students who gained Some Proficiency and Gained Full Proficiency in this skill.<br/><br/> This total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.'
export const studentsWithoutImprovementTooltipText = 'The total number of students who did not show improvement in this skill by not answering more questions correctly in the Post than the Pre (and who were not already proficient). Quill provides a recommended activity pack for each skill so that educators can easily assign practice activities so that students can practice this skill.<br/><br/> This total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.'
export const studentsMaintainedProficiencyTooltipText = 'The total number of students who answered all questions for this skill correctly on both the Pre and the Post diagnostic.<br/><br/> This total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.'

const noDataToShow = '--'

// Overview logic

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

function overallSkillGrowthValue({diagnosticId, overallSkillGrowth, handleGrowthChipClick}) {
  if (!overallSkillGrowth) {
    return noDataToShow;
  } else if (overallSkillGrowth > 0) {
    return <button className="interactive-wrapper emphasized-content" onClick={handleGrowthChipClick} value={diagnosticId}>{Math.round(overallSkillGrowth * 100)}%</button>
  }
  return 'No Growth';
}

function createAggregateRowData({ aggregateRowsDataForDiagnostic, diagnosticId, handleGrowthChipClick }) {
  return Object.keys(aggregateRowsDataForDiagnostic).map(key => {
    const data = aggregateRowsDataForDiagnostic[key];
    // we can early return if there are no students assigned to pre diagnostic
    if (!data.pre_students_assigned) { return null }
    const overallSkillGrowth = overallSkillGrowthValue({ diagnosticId, overallSkillGrowth: data.overall_skill_growth, handleGrowthChipClick });

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
  const { preDiagnosticAssignedData, postDiagnosticAssignedData, preDiagnosticCompletedData, postDiagnosticCompletedData, recommendationsData, setAggregatedData, handleSetNoDiagnosticDataAvailable, hasAdjustedFiltersFromDefault, setLoading, handleGrowthChipClick } = args;

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
    const { diagnostic_id, aggregate_rows, overall_skill_growth, post_students_completed } = entry
    postDiagnosticCompletedDataHash[diagnostic_id] = {
      overall_skill_growth,
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
    const overallSkillGrowth = postDiagnosticCompletedDataHash[id]?.overall_skill_growth
    const studentsCompletedPractice = recommendationsDataHash[id]?.students_completed_practice
    const averageActivitiesCount = recommendationsDataHash[id]?.average_practice_activities_count
    const averageTimespent = recommendationsDataHash[id]?.average_time_spent_seconds
    const aggregateRowsDataForDiagnostic = aggregateRowsData[id]
    entry.preDiagnosticCompleted = preDiagnosticCompletedValue(preStudentsAssigned, preStudentsCompleted)
    entry.studentsCompletedPractice = studentsCompletedPracticeValue(studentsCompletedPractice)
    entry.averageActivitiesAndTimeSpent = averageActivitiesAndTimeSpentValue(averageActivitiesCount, averageTimespent)
    entry.postDiagnosticCompleted = postDiagnosticCompleted(postStudentsAssigned, postStudentsCompleted)
    entry.overallSkillGrowth = overallSkillGrowthValue({diagnosticId: id, overallSkillGrowth, handleGrowthChipClick })
    entry.aggregate_rows = createAggregateRowData({ aggregateRowsDataForDiagnostic, diagnosticId: id, handleGrowthChipClick})
  })
  setAggregatedData(combinedData);
  setLoading(false);
}

// Skills logic

function scoreValue(score, studentCount) {
  if(!score) { return noDataToShow }
  return `${Math.round(score * 100)}% (${studentCount})`
}

function proficiencyValue(proficiencyLevelCount, totalStudents) {
  if(!totalStudents) { return noDataToShow }
  return `${proficiencyLevelCount} of ${totalStudents}`
}

function growthResultsValue(score, studentCount) {
  if (!score) {
    return noDataToShow;
  } else if (score > 0) {
    return `+${scoreValue(score, studentCount)}`
  }
  return 'No Gain';
}

function formatSkillsData(data, isAggregateRowData) {
  return data.map((entry, i) => {
    const { aggregate_rows, growth_percentage, improved_proficiency, maintained_proficiency, post_score, post_students_completed, pre_score, pre_students_completed, recommended_practice, skill_group_name, name } = entry
    return {
      id: i,
      name: isAggregateRowData ? name : skill_group_name,
      preSkillScore: scoreValue(pre_score, pre_students_completed),
      postSkillScore: scoreValue(post_score, post_students_completed),
      growthResults: growthResultsValue(growth_percentage, post_students_completed),
      studentsImprovedSkill: proficiencyValue(improved_proficiency, post_students_completed),
      studentsWithoutImprovement: proficiencyValue(recommended_practice, post_students_completed),
      studentsMaintainedProficiency: proficiencyValue(maintained_proficiency, post_students_completed),
      aggregate_rows: isAggregateRowData ? null : formatSkillsData(aggregate_rows, true)
    }
  })
}

export function aggregateSkillsData({
  skillsData,
  setAggregatedData,
  setLoading
}) {
  if (!skillsData.length) {
    setLoading(false)
    return
  }
  const aggregatedData = formatSkillsData(skillsData, false)
  setAggregatedData(aggregatedData)
  setLoading(false)
}
