import * as React from 'react';
import * as moment from 'moment';

import { requestPost, } from '../../../modules/request'
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'
import { DataTable, Spinner, informationIcon, smallWhiteCheckIcon } from '../../Shared';

const STANDARD_WIDTH = "152px";
const STUDENT_NAME = "Student Name";
const STUDENT_EMAIL = "Student Email";
const SCHOOL = "School";
const GRADE = "Grade";
const TEACHER = "Teacher";
const CLASS = "Class";
const COMPLETED_DATE = "Completed Date";
const ACTIVITY_PACK = "Activity Pack";
const ACTIVITY = "Activity";
const TOOL = "Tool";
const SCORE = "Score";
const STANDARD = "Standard";
const TIME_SPENT = "Time Spent";

const PUSHER_EVENT_KEY = "data-export-cached";

interface DataExportTableAndFieldsProps {
  customTimeframeEnd: string;
  customTimeframeStart: string;
  pusherChannel?: any;
  queryKey: string;
  searchCount: number;
  selectedClassroomIds: number[];
  selectedGrades: string[];
  selectedSchoolIds: number[];
  selectedTeacherIds: number[];
  selectedTimeframe: string;
}

export const DataExportTableAndFields = ({ queryKey, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, pusherChannel }: DataExportTableAndFieldsProps) => {
  const [showStudentEmail, setShowStudentEmail] = React.useState<boolean>(true);
  const [showSchool, setShowSchool] = React.useState<boolean>(true);
  const [showGrade, setShowGrade] = React.useState<boolean>(true);
  const [showTeacher, setShowTeacher] = React.useState<boolean>(true);
  const [showClass, setShowClass] = React.useState<boolean>(true);
  const [showCompletedDate, setShowCompletedDate] = React.useState<boolean>(true);
  const [showActivityPack, setShowActivityPack] = React.useState<boolean>(true);
  const [showActivity, setShowActivity] = React.useState<boolean>(true);
  const [showTool, setShowTool] = React.useState<boolean>(true);
  const [showScore, setShowScore] = React.useState<boolean>(true);
  const [showStandard, setShowStandard] = React.useState<boolean>(true);
  const [showTimeSpent, setShowTimeSpent] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>(null);
  console.log("🚀 ~ file: dataExportTableAndFields.tsx:53 ~ DataExportTableAndFields ~ data:", data)

  const fields = {
    [STUDENT_NAME]: {
      dataTableField: { name: STUDENT_NAME, attribute: "student_name", width: STANDARD_WIDTH },
      checked: true
    },
    [STUDENT_EMAIL]: {
      dataTableField: { name: STUDENT_EMAIL, attribute: "student_email", width: STANDARD_WIDTH },
      setterFunction: setShowStudentEmail,
      checked: showStudentEmail
    },
    [COMPLETED_DATE]: {
      dataTableField: { name: COMPLETED_DATE, attribute: "completed_at", width: STANDARD_WIDTH },
      setterFunction: setShowCompletedDate,
      checked: showCompletedDate
    },
    [ACTIVITY]: {
      dataTableField: { name: ACTIVITY, attribute: "activity_name", width: STANDARD_WIDTH },
      setterFunction: setShowActivity,
      checked: showActivity
    },
    [ACTIVITY_PACK]: {
      dataTableField: { name: ACTIVITY_PACK, attribute: "activity_pack", width: STANDARD_WIDTH },
      setterFunction: setShowActivityPack,
      checked: showActivityPack
    },
    [SCORE]: {
      dataTableField: { name: SCORE, attribute: "score", width: STANDARD_WIDTH },
      setterFunction: setShowScore,
      checked: showScore
    },
    [TIME_SPENT]: {
      dataTableField: { name: `${TIME_SPENT} (Mins)`, attribute: "timespent", width: STANDARD_WIDTH },
      setterFunction: setShowTimeSpent,
      checked: showTimeSpent
    },
    [STANDARD]: {
      dataTableField: { name: STANDARD, attribute: "standard", width: STANDARD_WIDTH },
      setterFunction: setShowStandard,
      checked: showStandard
    },
    [TOOL]: {
      dataTableField: { name: TOOL, attribute: "tool", width: STANDARD_WIDTH },
      setterFunction: setShowTool,
      checked: showTool
    },
    [SCHOOL]: {
      dataTableField: { name: SCHOOL, attribute: "school_name", width: STANDARD_WIDTH },
      setterFunction: setShowSchool,
      checked: showSchool
    },
    [GRADE]: {
      dataTableField: { name: GRADE, attribute: "classroom_grade", width: STANDARD_WIDTH },
      setterFunction: setShowGrade,
      checked: showGrade
    },
    [TEACHER]: {
      dataTableField: { name: TEACHER, attribute: "teacher_name", width: STANDARD_WIDTH },
      setterFunction: setShowTeacher,
      checked: showTeacher
    },
    [CLASS]: {
      dataTableField: { name: CLASS, attribute: "classroom_name", width: STANDARD_WIDTH },
      setterFunction: setShowClass,
      checked: showClass
    },
  };

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    initializePusher()
    getData()
  }, [searchCount])

  function getData() {

    const searchParams = {
      query: queryKey,
      timeframe: selectedTimeframe,
      timeframe_custom_start: customTimeframeStart,
      timeframe_custom_end: customTimeframeEnd,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades
    }

    requestPost('/snapshots/data_export', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        // We consider `null` to be a lack of data, so if the result is `[]` we need to explicitly `setData(null)`
        const data = results.length > 0 ? results : null
        const formattedData = formatData(data)
        setData(formattedData)
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      const queryKeysAreEqual = message.query === queryKey
      const timeframesAreEqual = message.timeframe === selectedTimeframe
      const schoolIdsAreEqual = unorderedArraysAreEqual(message.school_ids, selectedSchoolIds)
      const teacherIdsAreEqual = unorderedArraysAreEqual(message.teacher_ids, selectedTeacherIds)
      const classroomIdsAreEqual = unorderedArraysAreEqual(message.classroom_ids, selectedClassroomIds)
      const gradesAreEqual = unorderedArraysAreEqual(message.grades, selectedGrades.map(grade => String(grade))) || (!message.grades && !selectedGrades.length)

      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual && teacherIdsAreEqual && classroomIdsAreEqual) {
        getData()
      }
    });
  };

  function getTimeSpentInMinutes(seconds: number) {
    if (!seconds) {
      return 'N/A';
    }
    if (seconds < 60) {
      return `<1`;
    }
    if (seconds >= 60 && seconds < 120) {
      return '1';
    }
    return `${Math.floor((seconds % 3600) / 60)}`;
  }

  function formatData(data) {
    if(!data) { return null }

    return data.map(entry => {
      const formattedEntry = {...entry}
      const score = Math.round(parseFloat(entry.score) * 100);
      const percentage = isNaN(score) || score < 0 ? 'N/A' : score + '%';

      formattedEntry.completed_at = moment(entry.completed_at).format("MM/DD/YYYY");
      formattedEntry.timespent = getTimeSpentInMinutes(entry.timespent)
      formattedEntry.score = percentage
      return formattedEntry
    })
  }

  function toggleCheckbox(e) {
    e.preventDefault();
    const fieldLabel = e.currentTarget.id;
    const checked = fields[fieldLabel].checked;
    const setterFunction = fields[fieldLabel].setterFunction
    setterFunction(!checked);
  }

  function renderCheckboxes() {
    return Object.keys(fields).map((fieldLabel, i) => {
      // skip Student Name because we want this field to always be present
      if (i === 0) { return }

      let checkbox = (
        <div className="checkbox-container">
          <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" id={fieldLabel} onClick={toggleCheckbox} type="button" />
          <label htmlFor={fieldLabel}>{fieldLabel}</label>
        </div>
      )
      if (fields[fieldLabel].checked) {
        checkbox = (
          <div className="checkbox-container">
            <button aria-label="Checked checkbox" className="quill-checkbox selected" id={fieldLabel} onClick={toggleCheckbox} type="button">
              <img alt="Checked checkbox" src={smallWhiteCheckIcon.src} />
            </button>
            <label htmlFor={fieldLabel}>{fieldLabel}</label>
          </div>
        )
      }
      return checkbox;
    })
  }

  function getHeaders() {
    return Object.keys(fields).flatMap(fieldLabel => {
      const headerSelected = fields[fieldLabel].checked
      if (!headerSelected) { return [] }
      return fields[fieldLabel].dataTableField;
    })
  }

  // const testData = {
  //   group_by: "grade",
    const testData = [
      {
        name: "Starter Diagnostic",
        pre_students_completed: 88, // can by 0
        pre_students_assigned: 89,
        pre_first_completion: "2023-09-09", // can be null
        pre_last_completion: "2023-09-21", // can be null, ALSO may be the same as "pre_first_completion"
        /* possible addition
        "students_completed_practice": 50,
        */
        average_practice_activities_count: 33, // can be null
        average_time_spent_seconds: 165, // can be null
        post_students_completed: 25, // can be 0
        post_students_assigned: 35, // can be 0
        post_first_completion: "2023-11-29",  // can be null
        post_last_completion: "2023-12-24", // can be null,, ALSO may be the same as "post_first_completion"
        overall_skill_growth: 25, // can be null
        showAggregateRows: true,
        /* Not for initial release
        "quill_average_growth": 20,
        */
        aggregate_rows: [
          {
            name: "Grade 6",
            pre_students_completed: 45,
            pre_students_assigned: 46,
            pre_first_completion: "2023-09-09",
            pre_last_completion: "2023-09-21",
            average_practice_activities_count: 33,
            average_time_spent_seconds: 165,
            post_students_completed: 41,
            post_students_assigned: 45,
            post_first_completion: "2023-11-29",
            post_last_completion: "2023-12-24",
            overall_skill_growth: 25
          },
          {
            name: "No grade selected",
            pre_students_completed: 35,
            pre_students_assigned: 35,
            pre_first_completion: "2023-09-09",
            pre_last_completion: "2023-09-21",
            average_practice_activities_count: 33,
            average_time_spent_seconds: 165,
            post_students_completed: 41,
            post_students_assigned: 45,
            post_first_completion: "2023-11-29",
            post_last_completion: "2023-12-24",
            overall_skill_growth: 25
          }
        ]
      }, {
        name: "Advanced Diagnostic",
        pre_students_completed: 42,
        pre_students_assigned: 45,
        pre_first_completion: "2023-09-09",
        pre_last_completion: "2023-09-21",
        average_practice_activities_count: 33,
        average_time_spent_seconds: 165,
        post_students_completed: 39,
        post_students_assigned: 42,
        post_first_completion: "2023-11-29",
        post_last_completion: "2023-12-24",
        overall_skill_growth: 25,
        aggregate_rows: [
          {
            name: "Grade 6",
            pre_students_completed: 45,
            pre_students_assigned: 46,
            pre_first_completion: "2023-09-09",
            pre_last_completion: "2023-09-21",
            average_practice_activities_count: 33,
            average_time_spent_seconds: 165,
            post_students_completed: 41,
            post_students_assigned: 45,
            post_first_completion: "2023-11-29",
            post_last_completion: "2023-12-24",
            overall_skill_growth: 25
          },
          {
            name: "No grade selected",
            pre_students_completed: 35,
            pre_students_assigned: 35,
            pre_first_completion: "2023-09-09",
            pre_last_completion: "2023-09-21",
            average_practice_activities_count: 33,
            average_time_spent_seconds: 165,
            post_students_completed: 41,
            post_students_assigned: 45,
            post_first_completion: "2023-11-29",
            post_last_completion: "2023-12-24",
            overall_skill_growth: 25
          }
        ]
      },
      {
        name: "ELL Starter Diagnostic",
        pre_students_completed: 42,
        pre_students_assigned: 45,
        pre_first_completion: "2023-09-09",
        pre_last_completion: "2023-09-21",
        average_practice_activities_count: 33,
        average_time_spent_seconds: 165,
        post_students_completed: 39,
        post_students_assigned: 42,
        post_first_completion: "2023-11-29",
        post_last_completion: "2023-12-24",
        overall_skill_growth: 25,
        aggregate_rows: []
      }
    ]
  // }

  const testTableHeaders = [
    {
      name: 'Name',
      attribute: 'name',
      width: '100px'
    },
    {
      name: 'Pre Students Completed',
      attribute: 'pre_students_completed',
      width: '100px'
    },
    {
      name: 'Pre Students Assigned',
      attribute: 'pre_students_assigned',
      width: '100px'
    },
    {
      name: 'Pre First Completion',
      attribute: 'pre_first_completion',
      width: '100px'
    },
    {
      name: 'Pre Last Completion',
      attribute: 'pre_last_completion',
      width: '100px'
    },
    {
      name: 'Average Practice Activities Count',
      attribute: 'average_practice_activities_count',
      width: '100px'
    },
    {
      name: 'Average Time Spent',
      attribute: 'average_time_spent_seconds',
      width: '100px'
    },
    {
      name: 'Post Students Completed',
      attribute: 'post_students_completed',
      width: '100px'
    },
    {
      name: 'Post Students Assigned',
      attribute: 'post_students_assigned',
      width: '100px'
    },
    {
      name: 'Post First Completion',
      attribute: 'post_first_completion',
      width: '100px'
    },
    {
      name: 'Post Last Completion',
      attribute: 'post_last_completion',
      width: '100px'
    },
    {
      name: 'Overall Skill Growth',
      attribute: 'overall_skill_growth',
      width: '100px'
    },
  ]

  return(
    <div className="data-export-container">
      <section className="fields-section">
        <h3>Fields</h3>
        <div className="fields-container">
          {renderCheckboxes()}
        </div>
      </section>
      <section className="preview-section">
        <h3>Preview</h3>
        <div className="preview-disclaimer-container">
          <img alt={informationIcon.alt} src={informationIcon.src} />
          <p>This preview is limited to the first 10 results. Your download will include all activities.</p>
        </div>
      </section>
      {loading && <Spinner />}
      {!loading && <DataTable
        className="data-export-table"
        defaultSortAttribute="completed_at"
        defaultSortDirection="desc"
        emptyStateMessage="There are no activities available for the filters selected. Try modifying or removing a filter to see results."
        headers={getHeaders()}
        rows={data || []}
      />}
      <DataTable
        className="data-export-table"
        // defaultSortAttribute="completed_at"
        // defaultSortDirection="desc"
        // emptyStateMessage="There are no activities available for the filters selected. Try modifying or removing a filter to see results."
        headers={testTableHeaders}
        rows={testData}
      />
    </div>
  )
}

export default DataExportTableAndFields;
