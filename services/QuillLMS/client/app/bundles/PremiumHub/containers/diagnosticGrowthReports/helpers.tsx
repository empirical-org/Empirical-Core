import * as React from 'react'
import { getTimeInMinutesAndSeconds } from "../../shared"
import { getTimeSpent } from '../../../Teacher/helpers/studentReports'
import moment from 'moment'

const checkSrc = `${process.env.CDN_URL}/images/icons/circle-check-icon-vibrant-green.svg`
const loopSrc = `${process.env.CDN_URL}/images/icons/revise-icon-grey.svg`
const triangleSrc = `${process.env.CDN_URL}/images/icons/triangle-up-icon-vibrant-green-50.svg`

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

// Students tooltips
export const preToPostImprovedSkillsTooltipText = 'The number of skills the student showed improvement in on the Post diagnostic relative to the Pre diagnostic. A skill is considered improved if the student answered more questions for that skill correctly on the Post diagnostic than they did on the Pre.'
export const preQuestionsCorrectTooltipText = 'The total number of questions answered correctly on the Pre diagnostic.'
export const preSkillsProficientTooltipText = 'The number of skills the student demonstrated proficiency in on the Pre diagnostic. A student demonstrates proficiency by answering all questions for that skill correctly. If a student is not fully proficient in a skill, Quill provides a recommended activity pack so that teachers can easily assign practice activities.'
export const totalActivitiesAndTimespentTooltipText = 'Each diagnostic is linked to practice activities. This is the total number of activities completed that are linked to this particular diagnostic - not the total number of activities that the student has practiced on Quill.'
export const postQuestionsCorrectTooltipText = 'The total number of questions answered correctly on the Post diagnostic.'
export const postSkillsImprovedOrMaintainTooltipText = 'The number of skills the student maintained or showed improvement in on the Post diagnostic. A skill is considered “improved” if the student answered more questions for that skill correctly on the Post diagnostic than they did on the Pre. A skill is considered “maintained” if the student answered all questions for the skill correctly on both the Pre and the Post diagnostic.'

const noDataToShow = <p>&mdash;</p>

// Shared functions

// we use -1 so that null data values will be sorted last for the sort attribute
function getOverallSkillGrowthSortValue(preDiagnosticScore, postDiagnosticScore) {
  if ((!preDiagnosticScore && preDiagnosticScore !== 0) || (!postDiagnosticScore && postDiagnosticScore !== 0)) {
    return -1
  }
  return postDiagnosticScore - preDiagnosticScore >= 0 ? postDiagnosticScore - preDiagnosticScore : 0
}

function getSingleSortValue(value) {
  if(value === null || value === undefined) { return -1 }
  return value
}

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

function preDiagnosticCompletedValue({ diagnosticId, preStudentsAssigned, preStudentsCompleted, handleGrowthChipClick }) {
  if(!preStudentsAssigned) { return noDataToShow }
  return <button className="interactive-wrapper emphasized-content" onClick={handleGrowthChipClick} value={diagnosticId}>{`${preStudentsCompleted || 0} of ${preStudentsAssigned} Students`}</button>
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
    return <button className="interactive-wrapper emphasized-content" onClick={handleGrowthChipClick} value={diagnosticId}>{`+${Math.round(overallSkillGrowth * 100)}%`}</button>
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
      preDiagnosticCompleted: preDiagnosticCompletedValue({ diagnosticId, preStudentsAssigned: data.pre_students_assigned, preStudentsCompleted: data.pre_students_completed, handleGrowthChipClick }),
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
    const postStudentsAssigned = postDiagnosticAssignedDataHash[id]?.post_students_assigned
    const postStudentsCompleted = postDiagnosticCompletedDataHash[id]?.post_students_completed
    const overallSkillGrowth = postDiagnosticCompletedDataHash[id]?.overall_skill_growth
    const studentsCompletedPractice = recommendationsDataHash[id]?.students_completed_practice
    const averageActivitiesCount = recommendationsDataHash[id]?.average_practice_activities_count
    const averageTimespent = recommendationsDataHash[id]?.average_time_spent_seconds
    const aggregateRowsDataForDiagnostic = aggregateRowsData[id]
    entry.preDiagnosticCompleted = preDiagnosticCompletedValue({ diagnosticId: id, preStudentsAssigned, preStudentsCompleted, handleGrowthChipClick })
    entry.preStudentsCompleted = getSingleSortValue(preStudentsCompleted)
    entry.studentsCompletedPractice = studentsCompletedPracticeValue(studentsCompletedPractice)
    entry.completedPracticeCount = getSingleSortValue(studentsCompletedPractice)
    entry.averageActivitiesAndTimeSpent = averageActivitiesAndTimeSpentValue(averageActivitiesCount, averageTimespent)
    entry.averageActivitiesCount = getSingleSortValue(averageActivitiesCount)
    entry.postDiagnosticCompleted = postDiagnosticCompleted(postStudentsAssigned, postStudentsCompleted)
    entry.postStudentsCompleted = getSingleSortValue(postStudentsCompleted)
    entry.overallSkillGrowthSortValue = getSingleSortValue(overallSkillGrowth)
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
  if (score && score > 0) {
    return `+${scoreValue(score, studentCount)}`
  }
  return `No growth (${studentCount})`;
}

function formatSkillsData(data, isAggregateRowData) {
  return data.map((entry, i) => {
    const { aggregate_rows, growth_percentage, improved_proficiency, maintained_proficiency, post_score, post_students_completed, pre_score, pre_students_completed, recommended_practice, skill_group_name, name } = entry
    return {
      id: i,
      name: isAggregateRowData ? name : skill_group_name,
      preSkillScore: scoreValue(pre_score, pre_students_completed),
      pre_score: getSingleSortValue(pre_score),
      postSkillScore: scoreValue(post_score, post_students_completed),
      post_score: getSingleSortValue(post_score),
      growthResults: growthResultsValue(growth_percentage, post_students_completed),
      growthResultsSortValue: getSingleSortValue(growth_percentage),
      studentsImprovedSkill: proficiencyValue(improved_proficiency, post_students_completed),
      improved_proficiency: getSingleSortValue(improved_proficiency),
      studentsWithoutImprovement: proficiencyValue(recommended_practice, post_students_completed),
      recommended_practice: getSingleSortValue(recommended_practice),
      studentsMaintainedProficiency: proficiencyValue(maintained_proficiency, post_students_completed),
      maintained_proficiency: getSingleSortValue(maintained_proficiency),
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

// Students logic

/*
  Just a note that to determine if a pre diagnostic has not been completed, we look for a 0 value for pre_questions_total.
  Similarly, we look for a null value for post_questions_total to determine if a post diagnostic has not been completed yet.
*/

function getStudentNameValue({ name, preCompleted, previousRecord, nextRecord, preCompletedAt, postCompletedAt }) {
  const nameMatchesPreviousRecord = previousRecord && previousRecord.student_name === name
  const nameMatchesNextRecord = nextRecord && nextRecord.student_name === name
  const className = preCompleted ? '' : 'diagnostic-not-completed'
  let date

  if(preCompletedAt && postCompletedAt) {
    date = `(${moment(preCompletedAt).format('MM/DD')} - ${moment(postCompletedAt).format('MM/DD')})`
  } else if(preCompletedAt) {
    date = `(${moment(preCompletedAt).format('MM/DD') })`
  }
  if ((nameMatchesPreviousRecord || nameMatchesNextRecord) && date) {
    return(
      <div className="name-with-date">
        <p>{name}</p>
        <p>{date}</p>
      </div>
    )
  } else {
    return <p className={className}>{name}</p>
  }
}

function getPreToPostImprovedSkillsValue(count, postQuestionsTotal) {
  if(postQuestionsTotal === null) { return noDataToShow }
  if(count === 0) { return 'No improved skills'}
  return `+${count} Improved Skill${count === 1 ? '' : 's'}`
}

function getPreToPostImprovedSkillsSortValue(preCompleted, count, postQuestionsTotal) {
  if(!preCompleted) { return -2 }
  if(postQuestionsTotal === null) { return -1 }
  return count
}

function getQuestionsCorrectValue({ correctCount, total }) {
  if (!correctCount && !total) { return noDataToShow }
  return(
    <div>
      <p>{`${correctCount} of ${total} Questions`}</p>
      <p>{`(${Math.round((correctCount / total) * 100)}%)`}</p>
    </div>
  )
}

function getPreSkillsProficient({ proficientCount, practiceCount, skillsCount }) {
  return (
    <div>
      <p>{`${proficientCount} of ${skillsCount} Skills`}</p>
      {practiceCount ? <p>{`(${practiceCount} Skills to Practice)`}</p> : <p>(No Skills To Practice)</p>}
    </div>
  )
}

function getTotalActivities(student_id, recommendationsData) {
  const data = recommendationsData[student_id]
  if(!data) { return 0 }
  const { completed_activities } = data
  return completed_activities
}

function getTotalActivitiesAndTimespent(student_id, recommendationsData) {
  const data = recommendationsData[student_id]
  if(!data) {
    return <p>{noDataToShow}</p>
  }
  const { completed_activities, time_spent_seconds } = data
  return `${completed_activities} (${getTimeSpent(time_spent_seconds)})`
}

function getPostSkillsImprovedOrMaintained({ improvedCount, maintainedCount, combinedCount, skillsTotal, postQuestionsTotal }) {
  if (postQuestionsTotal === null) {
    return noDataToShow
  }
  return (
    <div>
      <p>{`${combinedCount} of ${skillsTotal} Skills`}</p>
      <p>{`(${improvedCount} Improved, ${maintainedCount} Maintained)`}</p>
    </div>
  )
}

const skillProficientElement = (
  <div className="skill-container green">
    <img alt="green circle with dark green checkmark" src={checkSrc} />
    <p>Skill Proficient</p>
  </div>
)

const skillMaintainedElement = (
  <div className="skill-container green">
    <img alt="green circle with dark green checkmark" src={checkSrc} />
    <p>Maintained Skill</p>
  </div>
)

const skillImprovedElement = (
  <div className="skill-container green">
    <img alt="green circle with dark green checkmark" src={checkSrc} />
    <p>Improved Skill</p>
  </div>
)

const skillToPracticeElement = (
  <div className="skill-container yellow">
    <img alt="revise icon" src={loopSrc} />
    <p>Skill To Practice</p>
  </div>
)

function renderSkillName(name, improved) {
  return(
    <div className="skill-name-container">
      <p className="skill-name">{name}</p>
      {!!improved && <img alt="bright green upward triangle" src={triangleSrc} />}
    </div>
  )
}

function renderEmbeddedScore(correctCount, totalCount) {
  if(totalCount === null) { return <td>{noDataToShow}</td> }

  return <td>{`${correctCount} of ${totalCount} Questions (${Math.round((correctCount/totalCount) * 100)}%)`}</td>
}

function renderPostEmbeddedSkillStatus(improved, maintained, total) {
  if(total === null) { return <td>{noDataToShow}</td> }
  if(improved) { return skillImprovedElement }
  if(maintained) { return skillMaintainedElement }

  return skillToPracticeElement
}

function renderEmbeddedTable(aggregate_rows) {
  if(!aggregate_rows) { return false }

  // grabbed from the header width of the parent table
  const parentTableWidth = document.getElementsByClassName('data-table-headers')[0]

  // 1188px is the current computed width of the embedded data table
  return(
    <div className="embedded-table-container" style={{ width: `${parentTableWidth?.offsetWidth || 1188}px`}}>
      <table className='embedded-student-growth-diagnostic-table'>
        <thead>
          <tr>
            <th className="diagnostic-skill">Diagnostic Skills</th>
            <th className="pre-questions-correct">Pre: Questions Correct</th>
            <th className="pre-skills-status">Pre: Skills Status</th>
            <th className="post-questions-correct">Post: Questions Correct</th>
            <th className="post-skills-status">Post: Skill Status</th>
          </tr>
        </thead>
        <tbody>
          {aggregate_rows.map(row => {
            const { skill_group_name, pre_questions_correct, pre_questions_percentage, pre_questions_total,
              post_questions_correct, post_questions_total, post_skills_improved, post_skills_maintained
            } = row

            if(!skill_group_name) { return }

            return(
              <tr>
                <td>{renderSkillName(skill_group_name, post_skills_improved)}</td>
                {renderEmbeddedScore(pre_questions_correct, pre_questions_total)}
                <td>{pre_questions_correct === pre_questions_total ? skillProficientElement : skillToPracticeElement}</td>
                {renderEmbeddedScore(post_questions_correct, post_questions_total)}
                <td>{renderPostEmbeddedSkillStatus(post_skills_improved, post_skills_maintained, post_questions_total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function aggregateStudentData(studentData, recommendationsData) {
  if(!studentData) { return null }
  return studentData.map((entry, i) => {
    const { student_id, student_name, pre_to_post_improved_skill_count, pre_questions_correct, pre_questions_total, pre_skills_proficient, pre_skills_to_practice, total_skills,
      post_questions_correct, post_questions_total, post_skills_improved, post_skills_maintained, post_skills_improved_or_maintained, pre_activity_session_completed_at, post_activity_session_completed_at, aggregate_rows
    } = entry
    // we don't want to render any data except for student name if pre diagnostic has not been completed yet
    const preCompleted = pre_questions_correct !== 0
    const previousRecord = i > 0 ? studentData[i - 1] : null
    const nextRecord = i < studentData.length - 1 ? studentData[i + 1] : null
    return {
      id: i,
      name: getStudentNameValue({ name: student_name, preCompleted, previousRecord, nextRecord, preCompletedAt: pre_activity_session_completed_at, postCompletedAt: post_activity_session_completed_at }),
      studentName: student_name,
      preToPostImprovedSkills: preCompleted ? getPreToPostImprovedSkillsValue(pre_to_post_improved_skill_count, post_questions_total) : 'Diagnostic not completed',
      improvedSkills: getPreToPostImprovedSkillsSortValue(preCompleted, pre_to_post_improved_skill_count, post_questions_total),
      preQuestionsCorrect: preCompleted ? getQuestionsCorrectValue({ correctCount: pre_questions_correct, total: pre_questions_total }) : null,
      preQuestionsCorrectSortValue: getSingleSortValue(pre_questions_correct),
      preSkillsProficient: preCompleted ? getPreSkillsProficient({ proficientCount: pre_skills_proficient, practiceCount: pre_skills_to_practice, skillsCount: total_skills }) : null,
      preSkillsProficientSortValue: getSingleSortValue(pre_skills_proficient),
      totalActivities: preCompleted ? getTotalActivities(student_id, recommendationsData) : -1,
      totalActivitiesAndTimespent: preCompleted ? getTotalActivitiesAndTimespent(student_id, recommendationsData) : null,
      postQuestionsCorrect: preCompleted ? getQuestionsCorrectValue({ correctCount: post_questions_correct, total: post_questions_total }) : null,
      postQuestionsCorrectSortValue: getSingleSortValue(post_questions_correct),
      postSkillsImprovedOrMaintained: preCompleted ? getPostSkillsImprovedOrMaintained({ improvedCount: post_skills_improved, maintainedCount: post_skills_maintained, combinedCount: post_skills_improved_or_maintained, skillsTotal: total_skills, postQuestionsTotal: post_questions_total}) : null,
      postSkillsImprovedOrMaintainedSortValue: getSingleSortValue(post_skills_improved_or_maintained),
      aggregate_rows: preCompleted ? aggregate_rows : null,
      renderEmbeddedTableFunction: preCompleted ? renderEmbeddedTable : null
    }
  })
}
