import * as React from 'react';
import { DataTable, informationIcon, smallWhiteCheckIcon } from '../../Shared';

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

export const DataExportTableAndFields = ({}) => {
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

  const fields = {
    [STUDENT_NAME]: {
      dataTableField: { name: STUDENT_NAME, attribute: "name", width: STANDARD_WIDTH },
      checked: true
    },
    [STUDENT_EMAIL]: {
      dataTableField: { name: STUDENT_EMAIL, attribute: "email", width: STANDARD_WIDTH },
      setterFunction: setShowStudentEmail,
      checked: showStudentEmail
    },
    [SCHOOL]: {
      dataTableField: { name: SCHOOL, attribute: "school", width: STANDARD_WIDTH },
      setterFunction: setShowSchool,
      checked: showSchool
    },
    [GRADE]: {
      dataTableField: { name: GRADE, attribute: "grade", width: STANDARD_WIDTH },
      setterFunction: setShowGrade,
      checked: showGrade
    },
    [TEACHER]: {
      dataTableField: { name: TEACHER, attribute: "teacher", width: STANDARD_WIDTH },
      setterFunction: setShowTeacher,
      checked: showTeacher
    },
    [CLASS]: {
      dataTableField: { name: CLASS, attribute: "class", width: STANDARD_WIDTH },
      setterFunction: setShowClass,
      checked: showClass
    },
    [COMPLETED_DATE]: {
      dataTableField: { name: COMPLETED_DATE, attribute: "completed_date", width: STANDARD_WIDTH },
      setterFunction: setShowCompletedDate,
      checked: showCompletedDate
    },
    [ACTIVITY_PACK]: {
      dataTableField: { name: ACTIVITY_PACK, attribute: "activity_pack", width: STANDARD_WIDTH },
      setterFunction: setShowActivityPack,
      checked: showActivityPack
    },
    [ACTIVITY]: {
      dataTableField: { name: ACTIVITY, attribute: "activity", width: STANDARD_WIDTH },
      setterFunction: setShowActivity,
      checked: showActivity
    },
    [TOOL]: {
      dataTableField: { name: TOOL, attribute: "tool", width: STANDARD_WIDTH },
      setterFunction: setShowTool,
      checked: showTool
    },
    [SCORE]: {
      dataTableField: { name: SCORE, attribute: "score", width: STANDARD_WIDTH },
      setterFunction: setShowScore,
      checked: showScore
    },
    [STANDARD]: {
      dataTableField: { name: STANDARD, attribute: "standard", width: STANDARD_WIDTH },
      setterFunction: setShowStandard,
      checked: showStandard
    },
    [TIME_SPENT]: {
      dataTableField: { name: TIME_SPENT, attribute: "time_spent", width: STANDARD_WIDTH },
      setterFunction: setShowTimeSpent,
      checked: showTimeSpent
    },
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
          <span>{fieldLabel}</span>
          <div className={`quill-checkbox ${selectedClass}`} onClick={toggleCheckbox} id={fieldLabel}>{checkboxImg}</div>
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
        <h2>Fields</h2>
        <div className="fields-container">
          {renderCheckboxes()}
        </div>
      </section>
      <section className="preview-section">
        <h2>Preview</h2>
        <div className="preview-disclaimer-container">
          <img alt={informationIcon.alt} src={informationIcon.src} />
          <p>This preview is limited to the first 10 results. Your download will include all activities.</p>
        </div>
      </section>
      <DataTable
        className="data-export-table"
        defaultSortAttribute="name"
        headers={getHeaders()}
        rows={[]}
      />
    </div>
  )
}

export default DataExportTableAndFields;
