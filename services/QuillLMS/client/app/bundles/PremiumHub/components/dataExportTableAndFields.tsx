import * as React from 'react';
import queryString from 'query-string';
import * as Pusher from 'pusher-js';

import { requestGet, } from '../../../modules/request'
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

interface DataExportTableAndFieldsProps {
  queryKey: string;
  selectedGrades: string[];
  selectedSchoolIds: number[];
  selectedTeacherIds: number[];
  selectedClassroomIds: number[];
  selectedTimeframe: string;
  customTimeframeStart: string;
  customTimeframeEnd: string;
  adminId: number;
}

export const DataExportTableAndFields = ({ queryKey, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, adminId }: DataExportTableAndFieldsProps) => {
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

  const fields = {
    [STUDENT_NAME]: {
      dataTableField: { name: STUDENT_NAME, attribute: "name", width: STANDARD_WIDTH, noTooltip: true },
      checked: true
    },
    [STUDENT_EMAIL]: {
      dataTableField: { name: STUDENT_EMAIL, attribute: "email", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowStudentEmail,
      checked: showStudentEmail
    },
    [SCHOOL]: {
      dataTableField: { name: SCHOOL, attribute: "school", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowSchool,
      checked: showSchool
    },
    [GRADE]: {
      dataTableField: { name: GRADE, attribute: "grade", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowGrade,
      checked: showGrade
    },
    [TEACHER]: {
      dataTableField: { name: TEACHER, attribute: "teacher", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowTeacher,
      checked: showTeacher
    },
    [CLASS]: {
      dataTableField: { name: CLASS, attribute: "class", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowClass,
      checked: showClass
    },
    [COMPLETED_DATE]: {
      dataTableField: { name: COMPLETED_DATE, attribute: "completed_date", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowCompletedDate,
      checked: showCompletedDate
    },
    [ACTIVITY_PACK]: {
      dataTableField: { name: ACTIVITY_PACK, attribute: "activity_pack", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowActivityPack,
      checked: showActivityPack
    },
    [ACTIVITY]: {
      dataTableField: { name: ACTIVITY, attribute: "activity", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowActivity,
      checked: showActivity
    },
    [TOOL]: {
      dataTableField: { name: TOOL, attribute: "tool", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowTool,
      checked: showTool
    },
    [SCORE]: {
      dataTableField: { name: SCORE, attribute: "score", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowScore,
      checked: showScore
    },
    [STANDARD]: {
      dataTableField: { name: STANDARD, attribute: "standard", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowStandard,
      checked: showStandard
    },
    [TIME_SPENT]: {
      dataTableField: { name: TIME_SPENT, attribute: "time_spent", width: STANDARD_WIDTH, noTooltip: true },
      setterFunction: setShowTimeSpent,
      checked: showTimeSpent
    },
  };

  React.useEffect(() => {
    if (queryKey && selectedTimeframe && selectedSchoolIds) {
      getData()
    }
  }, [queryKey, selectedTimeframe, selectedSchoolIds])

  function getData() {
    initializePusher()

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

    const requestUrl = queryString.stringifyUrl({ url: '/snapshots/data_export', query: searchParams }, { arrayFormat: 'bracket' })

    requestGet(`${requestUrl}`, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        // We consider `null` to be a lack of data, so if the result is `[]` we need to explicitly `setData(null)`
        const data = results.length > 0 ? results : null
        setData(data)
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('data-export-cached', (body) => {
      const { message, } = body

      const queryKeysAreEqual = message.query === queryKey
      const timeframesAreEqual = message.timeframe === selectedTimeframe
      const schoolIdsAreEqual = unorderedArraysAreEqual(message.school_ids, selectedSchoolIds.map(id => String(id)))
      const teacherIdsAreEqual = unorderedArraysAreEqual(message.teacher_ids, selectedTeacherIds.map(id => String(id)))
      const classroomIdsAreEqual = unorderedArraysAreEqual(message.classroom_ids, selectedClassroomIds.map(id => String(id)))
      const gradesAreEqual = unorderedArraysAreEqual(message.grades, selectedGrades.map(grade => String(grade))) || (!message.grades && !selectedGrades.length)

      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual && teacherIdsAreEqual && classroomIdsAreEqual) {
        getData()
      }
    });
  };

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
      const selected = fields[fieldLabel].checked;
      const selectedClass = selected ? "selected" : "unselected";
      const checkboxImg = selected ? <img alt="check" src={smallWhiteCheckIcon.src} /> : ""
      return (
        <div className="checkbox-container">
          <div className={`quill-checkbox ${selectedClass}`} onClick={toggleCheckbox} id={fieldLabel}>{checkboxImg}</div>
          <span>{fieldLabel}</span>
        </div>
      )
    })
  }

  function getHeaders() {
    return Object.keys(fields).flatMap(fieldLabel => {
      const headerSelected = fields[fieldLabel].checked
      if (!headerSelected) { return [] }
      return fields[fieldLabel].dataTableField;
    })
  }

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
      {loading && <Spinner/>}
      {!loading && <DataTable
        className="data-export-table"
        defaultSortAttribute="name"
        headers={getHeaders()}
        rows={[]}
      />}
    </div>
  )
}

export default DataExportTableAndFields;
